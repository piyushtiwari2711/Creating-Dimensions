const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const userRouter = require("./user");
const notesRouter = require("./notes");
// const paymentRouter = require('./payment')
//auth
//user
//notes
//payment
router.get("/", (req, res) => {
  res.send("hi from root router");
});
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/notes", notesRouter);
// router.use('/payment',paymentRouter)
module.exports = router;
