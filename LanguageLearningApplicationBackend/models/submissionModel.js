const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links submission to a student
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz", // Links submission to a quiz
      required: true,
    },
    answers: [{ type: Number, required: true }], // Student's selected answer indices
    score: {
      type: Number,
      default: 0, // Will be calculated based on correct answers
    },
    timestamp: {
      type: Date,
      default: Date.now, // Records when the quiz was submitted
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", SubmissionSchema);
module.exports = Submission;
