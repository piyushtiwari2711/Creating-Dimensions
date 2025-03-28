const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");

router.get("/", (req, res) => {
  res.send("hi from user router");
});

router.get("/notes", async (req, res) => {
  try {
    const { uid } = req.user;

    if (!uid) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const purchasedNotes = userSnap.data().purchasedNotes || [];

    if (purchasedNotes.length === 0) {
      return res.status(200).json({ success: true, notes: [] });
    }

    const notesData = [];

    // Fetch each note by searching in Firestore subcollections
    for (const noteId of purchasedNotes) {
      const categoriesSnap = await db.collection("categories").get();

      for (const categoryDoc of categoriesSnap.docs) {
        const subjectsSnap = await categoryDoc.ref.collection("subjects").get();

        for (const subjectDoc of subjectsSnap.docs) {
          const noteRef = subjectDoc.ref.collection("notes").doc(noteId);
          const noteSnap = await noteRef.get();

          if (noteSnap.exists) {
            notesData.push({ id: noteSnap.id, ...noteSnap.data() });
          }
        }
      }
    }

    return res.status(200).json({ success: true, notes: notesData });
  } catch (error) {
    console.error("Error fetching purchased notes:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/transactions", async (req, res) => {
  try {
    const { uid } = req.user;

    if (!uid) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch all orders associated with the user
    const ordersRef = db.collection("orders");
    const ordersSnap = await ordersRef.where("userId", "==", uid).get();

    if (ordersSnap.empty) {
      return res.status(200).json({ success: true, transactions: [] });
    }

    const transactions = [];

    // Fetch the note title for each transaction based on the hierarchical structure (category -> subject -> notes)
    for (const orderDoc of ordersSnap.docs) {
      const orderData = orderDoc.data();
      const noteId = orderData.noteId;

      // Find the note by category -> subject -> notes hierarchy
      let noteTitle = "Unknown Note Title"; // Default value in case note isn't found

      const categoriesSnap = await db.collection("categories").get();

      for (const categoryDoc of categoriesSnap.docs) {
        const subjectsSnap = await categoryDoc.ref.collection("subjects").get();

        for (const subjectDoc of subjectsSnap.docs) {
          const noteRef = subjectDoc.ref.collection("notes").doc(noteId);
          const noteSnap = await noteRef.get();

          if (noteSnap.exists) {
            noteTitle = noteSnap.data().title;
            break;
          }
        }

        if (noteTitle !== "Unknown Note Title") break;
      }

      transactions.push({
        id: orderDoc.id,
        noteTitle,
        ...orderData,
      });
    }

    return res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
