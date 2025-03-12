import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    selectedAnswers: [
      { type: Number, required: true }, // Stores the index of the chosen answer
    ],
    score: {
      type: Number, // Percentage score
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    attemptNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);
