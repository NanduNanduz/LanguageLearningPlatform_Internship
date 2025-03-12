import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Links quiz to a course
      required: true,
    },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [
          { text: { type: String, required: true } } // Multiple options per question
        ],
        correctAnswerIndex: { type: Number, required: true }, // Index of the correct option
      },
    ],
    maxAttempts: {
      type: Number,
      default: 3, // Max quiz attempts per student
    },
    passingScore: {
      type: Number,
      default: 50, // Percentage required to pass
    },
    timeLimit: {
      type: Number, // Time in minutes (optional)
    },
    submissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Submission",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", QuizSchema);
