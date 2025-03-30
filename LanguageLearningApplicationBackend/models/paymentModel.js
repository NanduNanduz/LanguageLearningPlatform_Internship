import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    refundStatus: {
      type: String,
      enum: [
        "Not Requested",
        "Requested",
        "Approved",
        "Rejected",
        "Processing",
        "Completed",
      ],
      default: "Not Requested",
    },
    refundIssued: {
      type: Boolean,
      default: false,
    },

    refundRequestDate: {
      type: Date,
    },
    refundProcessedDate: {
      type: Date,
    },
    refundReason: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
