const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/auth");

router.post("/verify", authenticateUser, (req, res) => {
  res.status(200).json({
    message: "User verified successfully",
    user: req.user,
  });
});

module.exports = router;
