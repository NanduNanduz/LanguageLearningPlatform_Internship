import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    price: {
      type: Number,
      required: true,
      default: 0, // Free courses have price 0
    },
    category: {
      type: String,
      enum: [
        "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", "Gujarati",
        "Kannada", "Odia", "Punjabi", "Malayalam", "Assamese", "Maithili",
        "Santali", "Kashmiri", "Konkani", "Sindhi", "Dogri", "Manipuri",
        "Bodo", "Sanskrit", "Nepali",
        "English", "Spanish", "French", "German", "Portuguese", "Mandarin Chinese",
        "Cantonese", "Japanese", "Korean", "Russian", "Italian", "Turkish",
        "Dutch", "Polish", "Greek", "Hebrew", "Arabic", "Persian (Farsi)",
        "Thai", "Vietnamese", "Malay", "Swedish", "Danish", "Finnish",
        "Norwegian", "Hungarian", "Czech", "Slovak", "Romanian", "Ukrainian",
        "Filipino (Tagalog)", "Swahili"
      ],
      required: [true, "Course category is required"],
    },
    thumbnail: {
      type: String,
      required: [true, "Course thumbnail is required"], // Image stored in Cloudinary/AWS S3
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User model (Instructor)
      required: true,
    },
    instructorName:{
      type:String
    },
    videos: [
      {
        videoTitle: { type: String, required: true },
        videoThumbnail: { type: String },
        videoUrl: { type: String, required: true }, // Stored in Cloudinary/AWS S3
      },
    ],
    resources: [
      {
        resourceName: { type: String, required: true },
        resourceUrl: { type: String, required: true }, // PDF/Notes URL
      },
    ],
    quizzes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz", // References the Quiz model
      },
    ],
    studentsEnrolled: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
        isCompleted: { type: Boolean, default: false }, // Stores course completion date
      },
    ],
    completedStudents: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        certificateUrl: { type: String },
        issuedAt: { type: Date, default: Date.now },
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true } // Auto-adds createdAt and updatedAt fields
);

export default mongoose.model("Course", CourseSchema);
