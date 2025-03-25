import mongoose from "mongoose";

const qaSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    answers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        answer: {
          type: String,
          required: true,
          maxlength: 5000,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        upvotes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        isInstructorAnswer: {
          type: Boolean,
          default: false,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("qa", qaSchema);
