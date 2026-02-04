const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  volunteer: String,
  taskId: String,
  amount: Number,
  currency: { type: String, default: "INR" },
  paymentMethod: { type: String, default: "razorpay" },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: { type: String, default: "paid" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);