const express = require("express");
const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const cloudinary = require("../config/cloudinary");
const slugify = require("slugify");
const { db } = require("../config/firebase");

// 🔥 Upload a Note
  router.post(
    "/upload",
    upload.fields([
      { name: "pdf", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        if (!req.files?.pdf || !req.files?.image) {
          return res.status(400).json({ error: "PDF and Image are required" });
        }

        let { title, description, price, category, subject } = req.body;
        if (!title || !price || !category || !subject) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        category = category.toLowerCase();
        subject = subject.toLowerCase();
        const folderPath = `notes/${slugify(category, { lower: true })}/${slugify(subject, { lower: true })}`;
        const fileName = `${slugify(title, { lower: true })}_${Date.now()}`;

        const cloudinaryUpload = (fileBuffer, resourceType, format) => {
          return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { resource_type: resourceType, format, folder: folderPath, public_id: fileName },
              (error, result) => (error ? reject(error) : resolve(result))
            );
            uploadStream.end(fileBuffer);
          });
        };

        const [pdfResult, imgResult] = await Promise.all([
          cloudinaryUpload(req.files.pdf[0].buffer, "raw", "pdf"),
          cloudinaryUpload(req.files.image[0].buffer, "image", "jpg"),
        ]);

        const noteData = {
          title,
          description,
          price: Number(price),
          pdfUrl: pdfResult.secure_url,
          pdfCloudinaryId: pdfResult.public_id,
          imgUrl: imgResult.secure_url,
          imgCloudinaryId: imgResult.public_id,
          cloudinaryFolder: folderPath,
          createdAt: Date.now(),
        };

        const noteId = await db.runTransaction(async (transaction) => {
          const categoryRef = db.collection("categories").doc(category);
          const subjectRef = categoryRef.collection("subjects").doc(subject);
          const notesCollection = subjectRef.collection("notes");
          const docRef = notesCollection.doc();

          transaction.set(categoryRef, { name: category }, { merge: true });
          transaction.set(subjectRef, { name: subject }, { merge: true });
          transaction.set(docRef, noteData);
          return docRef.id;
        });

        return res.status(201).json({ message: "Note uploaded successfully", noteId, note: noteData });
      } catch (error) {
        console.error("Upload Error:", error);
        return res.status(500).json({ error: "Upload failed", details: error.message });
      }
    }
  );

// 🔥 Delete a Note (Admin Only)
router.delete("/categories/:category/subjects/:subject/notes/:noteId", async (req, res) => {
  try {
    let { category, subject, noteId } = req.params;
    category = category.toLowerCase();
    subject = subject.toLowerCase();

    const noteRef = db.collection("categories").doc(category).collection("subjects").doc(subject).collection("notes").doc(noteId);

    await db.runTransaction(async (transaction) => {
      const noteSnapshot = await transaction.get(noteRef);
      if (!noteSnapshot.exists) {
        throw new Error("Note not found");
      }

      const noteData = noteSnapshot.data();
      await Promise.all([
        noteData.pdfCloudinaryId ? cloudinary.uploader.destroy(noteData.pdfCloudinaryId, { resource_type: "raw" }) : Promise.resolve(),
        noteData.imgCloudinaryId ? cloudinary.uploader.destroy(noteData.imgCloudinaryId, { resource_type: "image" }) : Promise.resolve(),
      ]);

      transaction.delete(noteRef);
    });

    return res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ error: "Failed to delete note", details: error.message });
  }
});

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
