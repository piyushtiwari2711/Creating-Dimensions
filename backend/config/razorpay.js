const Razorpay = require("razorpay");
require('dotenv').config();
const razorpay = new Razorpay({
  key_id: process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret,
});
module.exports = {razorpay};
