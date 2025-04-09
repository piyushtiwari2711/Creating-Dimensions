const express = require("express");
const router = express.Router();

const authRouter = require("./auth");
const userRouter = require("./user");
const notesRouter = require("./notes");
const paymentRouter = require("./payment");
const adminRouter = require("./admin");

const { authenticateUser } = require("../middleware/auth");
const nodemailer = require("nodemailer");

// Root route
router.get("/", (req, res) => {
  res.send("hi from root router");
});

// API Routes
router.use("/admin", adminRouter);
router.use("/auth", authRouter);
router.use("/user", authenticateUser, userRouter);
router.use("/notes", authenticateUser, notesRouter);
router.use("/payment", authenticateUser, paymentRouter);

// 💌 Send Email Route
router.post("/contact", async (req, res) => {
  const { firstName, lastName ,email, message } = req.body;

  // ✅ FIXED: Provide a 'from' field in mailOptions
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "piyushworks2711@gmail.com",
      pass: process.env.Emailpassword,
    },
  });

  const mailOptions = {
    from: "piyushworks2711@gmail.com",
    to: "piyush.2711tiwari@gmail.com",
    subject: "New Contact Form Enquiry",
    html: `
      <strong>Name:</strong> ${firstName}<br>
      <strong>Name:</strong> ${lastName}<br>
      <strong>Email:</strong> ${email}<br>
      <strong>Message:</strong><br>${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending email: ", error);
    res
      .status(500)
      .json({ success: false, message: "❌ Failed to send email.", error });

  } else {
    console.log("Email sent: ", info.response);
    res
      .status(200)
      .json({ success: true, message: "✅ Message sent successfully!",data:info.response });
  }
});
});

module.exports = router;
