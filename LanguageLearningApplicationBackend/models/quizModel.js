const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Links the quiz to a specific course
      required: true,
    },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }], // Multiple-choice options
      },
    ],
    correctAnswers: [{ type: Number, required: true }], // Index positions of correct options
    maxAttempts: {
      type: Number,
      default: 3, // Default max attempts per quiz
    },
    submissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission", // References student quiz submissions
      },
    ],
  },
  { timestamps: true } // Auto-adds createdAt and updatedAt fields
);

export default mongoose.model("Quiz", QuizSchema);

