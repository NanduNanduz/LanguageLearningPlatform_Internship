import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName:{
      type:String,
      required:true
    },
    profilePicture:{
      type:String,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Ratings are between 1 to 5
    },
    comment: {
      type: String,
      default: "",
      maxlength: 1000, // Limit review length
    },
  },
  { timestamps: true } // Auto adds createdAt & updatedAt
);


export default mongoose.model("Review", reviewSchema);
