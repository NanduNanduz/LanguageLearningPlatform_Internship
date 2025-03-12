import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String,
      enum: ['student', 'instructor', 'admin'],  
      default: 'student' 
    },
    createdAt: { type: Date, default: Date.now },
    blocked: { type: String, enum: ['yes', 'no'], default: 'no' },
    bio: {
      type: String,
      default: '',
      maxlength: 500
    },
    socialLinks: {
      github: { type: String, default: "" },
      linkedIn: { type: String, default: "" },
      twitter: { type: String, default: "" }
    },
    enrolledCourses: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        completedVideos: [{ type: mongoose.Schema.Types.ObjectId }], // Tracks completed video IDs
        completedResources: [{ type: mongoose.Schema.Types.ObjectId }], // Tracks completed resources
        quizScores: [
          {
            quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
            score: Number,
            passed: Boolean,
          },
        ],
        progressPercentage: { type: Number, default: 0 },
        completedAt: { type: Date, default: null }, // Stores course completion date
      },
    ],
    courseCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ],
    certificates: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        certificateUrl: { type: String },
        issuedAt: { type: Date, default: Date.now },
      },
    ],
    favourites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ],
    mobile: { type: Number },
    profilePicture: { type: String, default: "" },
    qualification: { type: String, default: "" },
    quizSubmissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
    lastActive: { type: Date, default: Date.now }, // Tracks user's last activity
    watchHistory: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        videoId: { type: mongoose.Schema.Types.ObjectId }, // Last watched video
        watchedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
