const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const userRouter = require("./user");
const notesRouter = require("./notes");
const paymentRouter = require('./payment')
const {authenticateUser} = require('../middleware/auth')
//auth
//user
//notes
//payment
router.get("/", (req, res) => {
  res.send("hi from root router");
});
router.use("/auth", authRouter);
router.use("/user",authenticateUser, userRouter);
router.use("/notes",authenticateUser, notesRouter);
router.use('/payment',authenticateUser,paymentRouter)
module.exports = router;
