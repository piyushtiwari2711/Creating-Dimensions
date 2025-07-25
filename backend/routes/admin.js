const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { google } = require("googleapis");
const slugify = require("slugify");
const { db } = require("../config/firebase");
const stream = require("stream");
const path = require("path");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const auth = new google.auth.GoogleAuth({
  keyFile: path.resolve(__dirname, "../diesel-boulder-454214-i0-fc9996822f0f.json"),
  scopes: ["https://www.googleapis.com/auth/drive"],
});

// Create drive client
const drive = google.drive({ version: "v3", auth });

// ✅ Upload a Note
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

      console.log("Uploading PDF & Image...");

      // Upload PDF to Cloudinary
      const base64Pdf = req.files.pdf[0].buffer.toString("base64");
      const pdfUploadPromise = cloudinary.uploader.upload(
        `data:application/pdf;base64,${base64Pdf}`,
        { resource_type: "auto", folder: folderPath, public_id: fileName }
      );

      // Upload image to Cloudinary
      const imageUploadPromise = cloudinaryUpload(req.files.image[0].buffer, "image", "jpg", folderPath, fileName);

      // Upload PDF to Google Drive
      const driveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || "root"; // Default to root if not configured
      const driveFileName = `${category}_${subject}_${fileName}.pdf`;
      const driveUploadPromise = googleDriveUpload(
        req.files.pdf[0].buffer,
        driveFileName,
        "application/pdf",
        driveFolderId
      );

      // Wait for all uploads to complete
      const [pdfResult, imgResult, driveFileId] = await Promise.all([
        pdfUploadPromise,
        imageUploadPromise,
        driveUploadPromise
      ]);

      // Generate initial drive link
      const driveLink = await generateDriveLink(driveFileId);

      const noteData = {
        title,
        description,
        price: Number(price),
        pdfUrl: pdfResult.secure_url,
        pdfCloudinaryId: pdfResult.public_id,
        imgUrl: imgResult.secure_url,
        imgCloudinaryId: imgResult.public_id,
        driveFileId: driveFileId,
        driveUrl: driveLink,
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

// ✅ Edit a Note
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

        if (req.files?.pdf) {
          // Delete old PDF from Cloudinary
          if (noteData.pdfCloudinaryId) {
            await cloudinary.uploader.destroy(noteData.pdfCloudinaryId, { resource_type: "raw" });
          }
          
          // Delete old PDF from Google Drive
          if (noteData.driveFileId) {
            try {
              await drive.files.delete({ fileId: noteData.driveFileId });
            } catch (driveError) {
              console.error("Failed to delete old Drive file:", driveError);
              // Continue with the update even if Drive delete fails
            }
          }
          
          // Upload new PDF to Cloudinary
          const base64Pdf = req.files.pdf[0].buffer.toString("base64");
          const pdfResult = await cloudinary.uploader.upload(
            `data:application/pdf;base64,${base64Pdf}`,
            { resource_type: "auto", folder: noteData.cloudinaryFolder }
          );
          
          // Upload new PDF to Google Drive
          const driveFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID || "root";
          const driveFileName = `${category}_${subject}_${slugify(title || noteData.title, { lower: true })}_${Date.now()}.pdf`;
          const driveFileId = await googleDriveUpload(
            req.files.pdf[0].buffer,
            driveFileName,
            "application/pdf",
            driveFolderId
          );
          
          // Generate new Drive link
          const driveLink = await generateDriveLink(driveFileId);
          
          updates.pdfUrl = pdfResult.secure_url;
          updates.pdfCloudinaryId = pdfResult.public_id;
          updates.driveFileId = driveFileId;
          updates.driveUrl = driveLink;
        }

        if (req.files?.image) {
          // Delete old image from Cloudinary
          if (noteData.imgCloudinaryId) {
            await cloudinary.uploader.destroy(noteData.imgCloudinaryId, { resource_type: "image" });
          }
          
          // Upload new image to Cloudinary
          const imgResult = await cloudinaryUpload(
            req.files.image[0].buffer, 
            "image", 
            "jpg", 
            noteData.cloudinaryFolder, 
            noteId
          );
          
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

// ✅ Delete a Note
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
      
      // Delete from Cloudinary and Google Drive
      await Promise.all([
        // Delete from Cloudinary
        noteData.pdfCloudinaryId ? cloudinary.uploader.destroy(noteData.pdfCloudinaryId, { resource_type: "raw" }) : Promise.resolve(),
        noteData.imgCloudinaryId ? cloudinary.uploader.destroy(noteData.imgCloudinaryId, { resource_type: "image" }) : Promise.resolve(),
        // Delete from Google Drive
        noteData.driveFileId ? drive.files.delete({ fileId: noteData.driveFileId }).catch(err => console.error("Drive delete error:", err)) : Promise.resolve()
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

// Get all transactions
router.get("/transactions", async (req, res) => {
  try {
    // Fetch all orders
    const ordersSnap = await db.collection("orders").get();

    if (ordersSnap.empty) {
      return res.status(200).json({ success: true, transactions: [] });
    }

    const transactions = [];
    const noteIds = new Set();
    const userIds = new Set();

    // Collect all note IDs and user IDs to batch fetch
    ordersSnap.docs.forEach((orderDoc) => {
      const orderData = orderDoc.data();
      if (orderData.noteId) noteIds.add(orderData.noteId);
      if (orderData.userId) userIds.add(orderData.userId);
    });

    // Fetch all categories
    const categoriesSnap = await db.collection("categories").get();
    const notesMap = new Map();

    // Loop through categories -> subjects -> notes
    for (const categoryDoc of categoriesSnap.docs) {
      const subjectsSnap = await categoryDoc.ref.collection("subjects").get();
      for (const subjectDoc of subjectsSnap.docs) {
        const notesSnap = await subjectDoc.ref.collection("notes").get();
        notesSnap.docs.forEach((noteDoc) => {
          if (noteIds.has(noteDoc.id)) {
            notesMap.set(noteDoc.id, noteDoc.data().title);
          }
        });
      }
    }

    // Fetch all users in a single query
    const usersSnap = await db.collection("users")
      .where("__name__", "in", Array.from(userIds))
      .get();
    const usersMap = new Map();
    usersSnap.docs.forEach((userDoc) => {
      usersMap.set(userDoc.id, userDoc.data().name); // Assuming 'name' field exists
    });

    // Build transactions response
    ordersSnap.docs.forEach((orderDoc) => {
      const orderData = orderDoc.data();
      transactions.push({
        id: orderDoc.id,
        noteTitle: notesMap.get(orderData.noteId) || "Unknown Note Title",
        buyerName: usersMap.get(orderData.userId) || "Unknown Buyer",
        ...orderData,
      });
    });

    return res.status(200).json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching admin transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Helper function for Cloudinary uploads
const cloudinaryUpload = (fileBuffer, resourceType, format, folderPath, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        format: format || undefined,
        folder: folderPath,
        public_id: fileName,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// ✅ Upload to Google Drive
const googleDriveUpload = async (fileBuffer, fileName, mimeType, folderId) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileBuffer);

  const fileMetadata = {
    name: fileName,
    parents: [folderId],
  };
  const media = {
    mimeType,
    body: bufferStream,
  };

  const file = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "id",
  });
  return file.data.id;
};

// ✅ Generate Expiring Drive Link
const generateDriveLink = async (fileId) => {
  await drive.permissions.create({
    fileId,
    requestBody: {
      role: "reader",
      type: "anyone",
      allowFileDiscovery:false
      // domain: 'http://localhost:5173',
      // expirationTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 24 hours expiry
    },
  });

  const file = await drive.files.get({
    fileId,
    fields: "webViewLink",
  });

  // await drive.files.update({
  //   fileId,
  //   requestBody: {
  //     copyRequiresWriterPermission: true,
  //   },
  // });

  return file.data.webViewLink;
};

module.exports = router;