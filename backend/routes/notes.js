const express = require("express");
const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const cloudinary = require('../config/cloudinary');
const slugify = require('slugify')
const { db } = require('../config/firebase');

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { title, description, price, category, subject } = req.body;

    if (!title || !price || !category || !subject) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    category = category.toLowerCase();
    subject = subject.toLowerCase();
    // Generate structured folder path
    const folderPath = `notes/${slugify(category, { lower: true })}/${slugify(subject, { lower: true })}`;
    const fileName = `${slugify(title, { lower: true })}_${Date.now()}`;

    // Cloudinary Upload
    const cloudinaryUpload = async () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            format: "pdf",
            folder: folderPath,
            public_id: fileName,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
    };

    const result = await cloudinaryUpload();

    // Firestore Transaction to Ensure Data Integrity
    const noteData = {
      title,
      description,
      price: Number(price),
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
      cloudinaryFolder: folderPath,
      createdAt: Date.now(),
    };

    const noteId = await db.runTransaction(async (transaction) => {
      const categoryRef = db.collection("categories").doc(category);
      const subjectRef = categoryRef.collection("subjects").doc(subject);
      const notesCollection = subjectRef.collection("notes");

      // Ensure category & subject exist
      transaction.set(categoryRef, { name: category }, { merge: true });
      transaction.set(subjectRef, { name: subject }, { merge: true });

      const docRef = notesCollection.doc();
      transaction.set(docRef, noteData);
      return docRef.id;
    });

    return res.status(201).json({
      message: "Note uploaded successfully",
      noteId,
      note: noteData,
    });

  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ error: "Upload failed", details: error.message });
  }
});
// 🔥 DELETE a note (Admin Only)
router.delete("/categories/:category/subjects/:subject/notes/:noteId", async (req, res) => {
  try {
    const { category, subject, noteId } = req.params;
     category = category.toLowerCase();
    subject = subject.toLowerCase();
    const noteRef = db
      .collection("categories")
      .doc(category)
      .collection("subjects")
      .doc(subject)
      .collection("notes")
      .doc(noteId);

    // Get the note data
    const noteSnapshot = await noteRef.get();
    if (!noteSnapshot.exists) {
      return res.status(404).json({ error: "Note not found" });
    }

    const noteData = noteSnapshot.data();

    // Delete file from Cloudinary
    if (noteData.cloudinaryId) {
      await cloudinary.uploader.destroy(noteData.cloudinaryId, { resource_type: "raw" });
    }

    // Delete note from Firestore
    await noteRef.delete();

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete note", details: error.message });
  }
});
// 🔥 GET all categories
router.get("/categories", async (req, res) => {
  try {
    const categoriesSnapshot = await db.collection("categories").get();

    if (categoriesSnapshot.empty) {
      return res.status(404).json({ message: "No categories found",categories:[] });
    }

    // Extract categories
    const categories = categoriesSnapshot.docs.map(doc => ({
      id: doc.id,   // Document ID (category name)
      name: doc.data().name  // Category name field
    }));

    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch categories", details: error.message });
  }
});
// 🔥 GET route to fetch all subjects for a given category
router.get("/categories/:category/subjects", async (req, res) => {
  try {
    const { category } = req.params;
 category = category.toLowerCase();
    const categoryRef = db.collection("categories").doc(category);
    const subjectsSnapshot = await categoryRef.collection("subjects").get();

    if (subjectsSnapshot.empty) {
      return res.status(404).json({ message: "No subjects found for this category",subjects:[] });
    }

    // Extract subjects
    const subjects = subjectsSnapshot.docs.map(doc => ({
      id: doc.id,   // Document ID (subject name)
      name: doc.data().name  // Subject name field
    }));

    return res.status(200).json({ subjects });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch subjects", details: error.message });
  }
});
// 🔥 GET route to fetch all notes for a given category and subject
router.get("/categories/:category/subjects/:subject/notes", async (req, res) => {
  try {
    const { category, subject } = req.params;
     category = category.toLowerCase();
    subject = subject.toLowerCase();
    const subjectRef = db.collection("categories").doc(category).collection("subjects").doc(subject);
    const notesSnapshot = await subjectRef.collection("notes").get();

    if (notesSnapshot.empty) {
      return res.status(404).json({ message: "No notes found for this subject",notes:[] });
    }

    // Extract notes
    const notes = notesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() // Spreads all note data (title, description, price, fileUrl, etc.)
    }));

    return res.status(200).json({ notes });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch notes", details: error.message });
  }
});
module.exports = router;
