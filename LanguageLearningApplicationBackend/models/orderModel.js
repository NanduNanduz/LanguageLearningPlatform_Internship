const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    img: {
      type: String,
      required: false, // Stores course thumbnail URL
    },
    isCompleted: { type: Boolean, default: false },
    payment_intent: { type: String, required: true }, // Stripe/Razorpay ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
