const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { db, admin } = require("../config/firebase");
const { razorpay } = require("../config/razorpay");
const { v4: uuidv4 } = require("uuid");

// 🔹 Create a Payment Order (with Firestore Transaction)
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency, userId, noteId } = req.body;

    if (!amount || !currency || !userId || !noteId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.runTransaction(async (transaction) => {
      const userRef = db.collection("users").doc(userId);
      const orderRef = db.collection("orders");

      const userSnap = await transaction.get(userRef);

      // Step 1: Check if user already purchased the note
      if (userSnap.exists && userSnap.data().purchasedNotes?.includes(noteId)) {
        throw new Error("Note already purchased");
      }

      // Step 2: Create Razorpay Order
      const options = {
        amount: amount * 100, // Convert to paise
        currency,
        receipt: uuidv4(),
      };

      const order = await razorpay.orders.create(options);

      // Step 3: Store order in Firestore within the transaction
      transaction.set(orderRef.doc(order.id), {
        userId,
        orderId: order.id,
        noteId,
        amount,
        currency,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.json(order);
    });
  } catch (error) {
    console.error("Error creating order:", error);
    const statusCode = error.message === "Note already purchased" ? 400 : 500;
    res.status(statusCode).json({ error: error.message });
  }
});

// 🔹 Verify Payment & Grant Access (with Firestore Transaction)
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      noteId,
      userId,
    } = req.body;

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature ||
      !noteId ||
      !userId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Step 1: Verify Razorpay Signature
    const secret = process.env.Razorpay_Secret;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Step 2: Update Firestore using a Transaction
    await db.runTransaction(async (transaction) => {
      const orderRef = db.collection("orders").doc(razorpay_order_id);
      const userRef = db.collection("users").doc(userId);

      const orderSnap = await transaction.get(orderRef);
      const userSnap = await transaction.get(userRef);

      if (!orderSnap.exists) {
        throw new Error("Order not found");
      }

      // Step 3: Ensure user document exists
      if (!userSnap.exists) {
        transaction.set(userRef, { purchasedNotes: [] });
      }

      // Step 4: Update order & user atomically
      transaction.update(orderRef, {
        status: "paid",
        paymentId: razorpay_payment_id,
      });

      transaction.update(userRef, {
        purchasedNotes: admin.firestore.FieldValue.arrayUnion(noteId),
      });
    });

    res
      .status(200)
      .json({ success: true, message: "Payment verified and note added!" });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 🔹 Razorpay Webhook for Automatic Payment Updates
router.post(
  "/webhook",
  express.json({ type: "application/json" }),
  async (req, res) => {
    try {
      const secret = process.env.WEBHOOK_SECRET;

      const shasum = crypto.createHmac("sha256", secret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest("hex");

      if (digest !== req.headers["x-razorpay-signature"]) {
        return res.status(400).json({ error: "Invalid signature" });
      }

      const event = req.body.event;

      if (event === "payment.captured") {
        const payment = req.body.payload.payment.entity;

        await db.runTransaction(async (transaction) => {
          const orderRef = db.collection("orders").doc(payment.order_id);
          const orderSnap = await transaction.get(orderRef);

          if (!orderSnap.exists) {
            throw new Error("Order not found");
          }

          const orderData = orderSnap.data();
          const userRef = db.collection("users").doc(orderData.userId);

          // Ensure user document exists before updating
          const userSnap = await transaction.get(userRef);
          if (!userSnap.exists) {
            transaction.set(userRef, { purchasedNotes: [] });
          }

          // Update order and user atomically
          transaction.update(orderRef, {
            status: "paid",
            paymentId: payment.id,
          });

          transaction.update(userRef, {
            purchasedNotes: admin.firestore.FieldValue.arrayUnion(
              orderData.noteId
            ),
          });
        });

        console.log("Payment captured via webhook:", req.body);
      } else if (event === "payment.failed") {
        const payment = req.body.payload.payment.entity;
        const orderRef = db.collection("orders").doc(payment.order_id);

        await orderRef.update({
          status: "failed",
        });

        console.error("Payment failed:", payment);
      }

      res.json({ status: "ok" });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

module.exports = router;
