const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { google } = require("googleapis");
const slugify = require("slugify");
const { db } = require("../config/firebase");
const stream = require("stream");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const account = require('../diesel-boulder-454214-i0-fc9996822f0f.json')
const auth = new google.auth.GoogleAuth({
  keyFile: account,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

// ✅ Upload to Cloudinary
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
      expirationTime: new Date(Date.now() + 1 * 60 * 60 * 1000), // 24 hours expiry
    },
  });
  
  const file = await drive.files.get({
    fileId,
    fields: "webViewLink",
  });

  return file.data.webViewLink;
};

// ✅ Generate Expiring Download Links
router.get("/download/:noteId", async (req, res) => {
  try {
    const noteDoc = await db.collection("notes").doc(req.params.noteId).get();
    if (!noteDoc.exists) return res.status(404).json({ error: "Note not found" });

    const noteData = noteDoc.data();
    const driveExpiringLink = await generateDriveLink(noteData.driveFileId);
    
    return res.status(200).json({
      cloudinaryDownloadUrl: noteData.pdfUrl,
      driveDownloadUrl: driveExpiringLink,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to generate download links", details: error.message });
  }
});

