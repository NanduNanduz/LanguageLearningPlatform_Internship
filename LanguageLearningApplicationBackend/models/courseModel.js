const mongoose = require("mongoose");

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
          // **Indian Languages**
          "Hindi", "Bengali", "Telugu", "Marathi", "Tamil", "Urdu", "Gujarati", 
          "Kannada", "Odia", "Punjabi", "Malayalam", "Assamese", "Maithili", 
          "Santali", "Kashmiri", "Konkani", "Sindhi", "Dogri", "Manipuri", 
          "Bodo", "Sanskrit", "Nepali",
          
          // **Commonly Used Global Languages**
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
      type: String,
      ref: "User", // Reference to User model (Instructor)
      required: true,
    },
    videos: [
      {
        videoTitle: { type: String, required: true },
        videoThumbnail :{type : String},
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the User model (Students)
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review", // References the Review model
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending", // Courses require admin approval before publishing
    },
  },
  { timestamps: true } // Auto-adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Course',CourseSchema);
