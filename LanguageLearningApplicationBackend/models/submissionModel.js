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
    correctAnswersCount: {
      type: Number, // Stores how many answers were correct
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
    timeTaken: {
      type: Number, // Time in seconds
      default: null, // Optional field
    },
    isBestAttempt: {
      type: Boolean, // Marks if this is the highest-scoring attempt
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);
