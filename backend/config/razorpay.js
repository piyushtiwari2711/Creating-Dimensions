const Razorpay = require("razorpay");
require('dotenev').config();
const razorpay = new Razorpay({
  key_id: "your_key_id",
  key_secret: "your_key_secret",
});
module.exports = {razorpay};