import courseModel from "../models/courseModel.js";
import cloudinary from "cloudinary";
import { deleteLocalFiles } from "../utils/multer.js";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get course details
export const getCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const deletedCourse = await courseModel.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit course details
export const editCourseDetails = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedData = req.body;

    const updatedCourse = await courseModel.findByIdAndUpdate(courseId, updatedData, { new: true });
    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, message: "Course details updated", course: updatedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Adding new course and uploading video with it
export const createCourse = async (req, res) => {
  try {
    const { title, description,price ,category, instructorId } = req.body;

    // Parse videos metadata (JSON)
    let videosArray = [];
    if (req.body.videos) {
      try {
        videosArray = JSON.parse(req.body.videos);
      } catch (error) {
        return res.status(400).json({ success: false, message: "Invalid JSON format in videos field" });
      }
    }

    // Check if required files are provided
    if (!req.files || !req.files.thumbnail || !req.files.videos || !req.files.videoThumbnails) {
      return res.status(400).json({ success: false, message: "Missing required files" });
    }

    // Upload course thumbnail
    const thumbnailUpload = await cloudinary.v2.uploader.upload(req.files.thumbnail[0].path, {
      folder: "course_thumbnails",
    });

    // Upload videos and their thumbnails
    const videoUploads = await Promise.all(videosArray.map(async (video, index) => {
      const videoThumbnailUpload = await cloudinary.v2.uploader.upload(req.files.videoThumbnails[index].path, {
        folder: "course_video_thumbnails",
      });

      const videoUpload = await cloudinary.v2.uploader.upload(req.files.videos[index].path, {
        folder: "course_videos",
        resource_type: "video",
      });

      return {
        videoTitle: video.videoTitle,
        videoThumbnail: videoThumbnailUpload.secure_url,
        videoUrl: videoUpload.secure_url,
      };
    }));

    deleteLocalFiles([...req.files.thumbnail, ...req.files.videoThumbnails, ...req.files.videos]);

    // Create course object
    const newCourse = new courseModel({
      title,
      price,
      category,
      description,
      thumbnail: thumbnailUpload.secure_url,
      instructorId,
      videos: videoUploads,
    });

    // Save course to database
    await newCourse.save();

    res.status(201).json({ success: true, course: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

