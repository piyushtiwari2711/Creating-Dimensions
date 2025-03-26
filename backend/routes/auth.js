const express = require("express");
const router = express.Router();
// const { admin } = require("../config/firebase");
// const { signupType } = require("../utility/types");
const { authenticateUser } = require("../middleware/auth");
// const auth = admin.auth(); // Ensure Firebase auth instance is initialized

// Signup route
// router.post("/signup", async (req, res) => {
//   try {
//     const { email, password, fullName } = req.body;

//     // Validate input using Zod
//     const parsedData = signupType.safeParse({ email, password, fullName });

//     if (!parsedData.success) {
//       return res.status(400).json({
//         message: "Validation failed",
//         errors: parsedData.error.errors, // Detailed validation errors
//       });
//     }

//     // Create user in Firebase Authentication
//     const userRecord = await auth.createUser({
//       email,
//       password,
//       displayName: fullName,
//     });

//     // Generate ID Token for authentication
//     const idToken = await auth.createCustomToken(userRecord.uid);

//     res.status(201).json({
//       message: "User created successfully",
//       user: {
//         uid: userRecord.uid,
//         email: userRecord.email,
//         fullName: userRecord.displayName,
//       },
//       token: idToken, // JWT token for authentication
//     });
//   } catch (error) {
//     console.error("Signup Error:", error);

//     // Handle specific Firebase Authentication errors
//     if (error.code === "auth/email-already-exists") {
//       return res.status(400).json({ message: "Email is already in use" });
//     }
//     if (error.code === "auth/invalid-email") {
//       return res.status(400).json({ message: "Invalid email format" });
//     }
//     if (error.code === "auth/weak-password") {
//       return res.status(400).json({ message: "Password is too weak" });
//     }

//     res.status(500).json({ message: "Signup failed", error: error.message });
//   }
// });
// // Signin route
// router.post("/signin", authenticateUser, (req, res) => {
//   res.status(200).json({
//     message: "User signed in successfully",
//     user: req.user, // Extracted from token by `authenticateUser`
//   });
// });
// Verify-me route
router.post("/verify", authenticateUser, (req, res) => {
  res.status(200).json({
    message: "User verified successfully",
    user: req.user,
  });
});

module.exports = router;
