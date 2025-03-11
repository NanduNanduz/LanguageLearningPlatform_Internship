const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Ratings are between 1 to 5
    },
    comment: {
      type: String,
      default: "",
      maxlength: 1000, // Limit review length
    },
  },
  { timestamps: true } // Auto adds createdAt & updatedAt
);

module.exports = mongoose.model("Review", reviewSchema);
