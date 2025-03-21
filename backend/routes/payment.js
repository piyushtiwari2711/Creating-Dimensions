const express = require('express');
const router = express.Router();
const crypto = require("crypto");
const {db} = require('../config/firebase')
const {razorpay} = require('../config/razorpay')
// 🔹 Create a payment order before purchase
app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency, userId, notesId } = req.body;

    const options = {
      amount: amount * 100, // Convert to paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Store order in Firestore with notesId
    await db.collection("orders").doc(order.id).set({
      userId,
      orderId: order.id,
      notesId, // Store the notes being purchased
      amount,
      currency,
      status: "pending",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
});

// 🔹 Verify payment & grant access
app.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const orderRef = db.collection("orders").doc(razorpay_order_id);
  const orderSnap = await orderRef.get();

  if (!orderSnap.exists) {
    return res.status(400).json({ error: "Order not found" });
  }

  const orderData = orderSnap.data();

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", "your_key_secret")
    .update(body)
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    // Update order status
    await orderRef.update({
      status: "paid",
      paymentId: razorpay_payment_id,
    });

    // Store purchased notes in the user’s collection
    const userRef = db.collection("users").doc(orderData.userId);
    await userRef.update({
      purchasedNotes: admin.firestore.FieldValue.arrayUnion(orderData.notesId),
    });

    res.json({ success: true });
  } else {
    res.status(400).json({ error: "Invalid signature" });
  }
});

app.post("/webhook", express.json({ type: "application/json" }), async (req, res) => {
  const secret = "your_webhook_secret";

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest !== req.headers["x-razorpay-signature"]) {
    return res.status(400).json({ error: "Invalid signature" });
  }

  if (req.body.event === "payment.captured") {
    const payment = req.body.payload.payment.entity;

    const orderRef = db.collection("orders").doc(payment.order_id);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return res.status(400).json({ error: "Order not found" });
    }

    const orderData = orderSnap.data();

    await orderRef.update({
      status: "paid",
      paymentId: payment.id,
    });

    // Store purchased notes in the user’s collection
    const userRef = db.collection("users").doc(orderData.userId);
    await userRef.update({
      purchasedNotes: admin.firestore.FieldValue.arrayUnion(orderData.notesId),
    });

    console.log("Payment captured via webhook:", payment);
  }

  res.json({ status: "ok" });
});


module.exports = router;