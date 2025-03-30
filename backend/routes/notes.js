const express = require("express");
const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const cloudinary = require("../config/cloudinary");
const slugify = require("slugify");
const { db } = require("../config/firebase");

// 🔥 Get all Categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await db.runTransaction(async (transaction) => {
      const categoriesSnapshot = await transaction.get(db.collection("categories"));
      return categoriesSnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
    });

    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch categories", details: error.message });
  }
});

// 🔥 Get all Subjects for a given Category
router.get("/categories/:category/subjects", async (req, res) => {
  try {
    let { category } = req.params;
    category = category.toLowerCase();

    const subjects = await db.runTransaction(async (transaction) => {
      const categoryRef = db.collection("categories").doc(category);
      const subjectsSnapshot = await transaction.get(categoryRef.collection("subjects"));
      return subjectsSnapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name }));
    });

    return res.status(200).json({ subjects });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch subjects", details: error.message });
  }
});

// 🔥 Get all Notes for a given Category and Subject
router.get("/categories/:category/subjects/:subject/notes", async (req, res) => {
  try {
    let { category, subject } = req.params;
    category = category.toLowerCase();
    subject = subject.toLowerCase();

    const notes = await db.runTransaction(async (transaction) => {
      const subjectRef = db.collection("categories").doc(category).collection("subjects").doc(subject);
      const notesSnapshot = await transaction.get(subjectRef.collection("notes"));
      return notesSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          price: data.price,
          imgUrl: data.imgUrl
        };
      });
    });

    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch notes", details: error.message });
  }
});


module.exports = router;
