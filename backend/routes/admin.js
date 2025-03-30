const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const cloudinary = require("../config/cloudinary");
const slugify = require("slugify");
const { db } = require("../config/firebase");

const router = express.Router();

// 🔥 Upload a Note
router.post(
  "/notes/upload",
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
        cloudinaryUpload(req.files.pdf[0].buffer, "raw", ""),
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

// 🔄 Edit a Note
router.put(
  "/categories/:category/subjects/:subject/notes/:noteId",
  upload.fields([
    { name: "pdf", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      let { category, subject, noteId } = req.params;
      category = category.toLowerCase();
      subject = subject.toLowerCase();
      
      const { title, description, price } = req.body;
      if (!title && !description && !price && !req.files?.pdf && !req.files?.image) {
        return res.status(400).json({ error: "No updates provided" });
      }
      
      const noteRef = db
        .collection("categories")
        .doc(category)
        .collection("subjects")
        .doc(subject)
        .collection("notes")
        .doc(noteId);
      
      await db.runTransaction(async (transaction) => {
        const noteSnapshot = await transaction.get(noteRef);
        if (!noteSnapshot.exists) {
          throw new Error("Note not found");
        }
        
        const noteData = noteSnapshot.data();
        let updates = {};
        
        if (title) updates.title = title;
        if (description) updates.description = description;
        if (price) updates.price = Number(price);
        
        // Handle PDF update
        if (req.files?.pdf) {
          if (noteData.pdfCloudinaryId) {
            await cloudinary.uploader.destroy(noteData.pdfCloudinaryId, { resource_type: "raw" });
          }
          const pdfResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { resource_type: "raw", format: "pdf", folder: noteData.cloudinaryFolder },
              (error, result) => (error ? reject(error) : resolve(result))
            );
            uploadStream.end(req.files.pdf[0].buffer);
          });
          updates.pdfUrl = pdfResult.secure_url;
          updates.pdfCloudinaryId = pdfResult.public_id;
        }
        
        // Handle Image update
        if (req.files?.image) {
          if (noteData.imgCloudinaryId) {
            await cloudinary.uploader.destroy(noteData.imgCloudinaryId, { resource_type: "image" });
          }
          const imgResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
              { resource_type: "image", format: "jpg", folder: noteData.cloudinaryFolder },
              (error, result) => (error ? reject(error) : resolve(result))
            );
            uploadStream.end(req.files.image[0].buffer);
          });
          updates.imgUrl = imgResult.secure_url;
          updates.imgCloudinaryId = imgResult.public_id;
        }
        
        transaction.update(noteRef, updates);
      });
      
      return res.status(200).json({ message: "Note updated successfully" });
    } catch (error) {
      console.error("Edit Error:", error);
      return res.status(500).json({ error: "Failed to update note", details: error.message });
    }
  }
);

// ❌ Delete a Note
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

// 📝 Get All Notes
router.get("/notes", async (req, res) => {
  try {
    const categoriesSnapshot = await db.collection("categories").get();
    let allNotes = [];

    for (const categoryDoc of categoriesSnapshot.docs) {
      const category = categoryDoc.id;
      const subjectsSnapshot = await categoryDoc.ref.collection("subjects").get();

      for (const subjectDoc of subjectsSnapshot.docs) {
        const subject = subjectDoc.id;
        const notesSnapshot = await subjectDoc.ref.collection("notes").orderBy("createdAt", "desc").get();

        const notes = notesSnapshot.docs.map(doc => ({
          id: doc.id,
          category,
          subject,
          ...doc.data()
        }));

        allNotes = [...allNotes, ...notes];
      }
    }

    return res.status(200).json({ notes: allNotes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return res.status(500).json({ error: "Failed to fetch notes", details: error.message });
  }
});
module.exports = router;
