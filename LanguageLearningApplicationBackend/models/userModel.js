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
        quizScores: [
          {
            quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
            score: Number,
            passed: Boolean,
          },
        ],
        assignments: [
          {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
            title:{type:String, required:true},
            assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Ref to assignment
            fileUrl: { type: String, required: true }, // URL of submitted assignment file
            submittedAt: { type: Date, default: Date.now }, // Submission timestamp
            feedback: { type: String }, // Optional feedback from instructor
          },
        ],
        progressPercentage: { type: Number, default: 0 },
        completedAt: { type: Date, default: null }, // Stores course completion date
      },
    ],
    courseCreated: [
      {
        courseId:mongoose.Schema.Types.ObjectId,
        courseTitle:String
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
