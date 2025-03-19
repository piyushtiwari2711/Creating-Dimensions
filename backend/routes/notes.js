const express = require("express");
const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const cloudinary = require('../config/cloudinary')
// 🔹 Upload a new note (Admin Only)
// router.post("/upload", (req, res) => {
//     const {title,decription,price,category,subject} = req.body;
// });
router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload to Cloudinary from buffer
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "raw" }, // Required for non-image files
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ message: "Upload successful", url: result.secure_url });
      } 
    ).end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

// 🔹 Update a note (Admin Only)
router.put("/:id", (req, res) => {
    
});

// 🔹 Delete a note (Admin Only)
router.delete("/:id", (req, res) => {
    
});

// 🔹 Get all available notes
router.get("/", (req, res) => {
    
});

// 🔹 Get a single note by ID
router.get("/:id", (req, res) => {
    
});

// 🔹 Download purchased note (Auth Required)
router.get("/download/:id", (req, res) => {
    
});

module.exports = router;
