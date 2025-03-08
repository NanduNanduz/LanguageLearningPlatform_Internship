import courseModel from "../models/courseModel.js";
import cloudinary from "cloudinary"; // Import Cloudinary SDK

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Course (with optional videos & thumbnails)
export const createCourse = async (req, res) => {
    try {
        const { title, description, price, category, instructorId, videos } = req.body;

        if (!instructorId) {
            return res.status(400).json({ success: false, message: "Instructor ID is required!" });
        }

        const thumbnailUrl = req.file ? req.file.path : "";

        let uploadedVideos = [];

        if (videos && videos.length > 0) {
            for (let video of videos) {
                const videoUpload = await cloudinary.uploader.upload(video.path, {
                    folder: `Learning Platform/${instructorId}/courses/videos`,
                    resource_type: "video",
                });

                const thumbnailUpload = await cloudinary.uploader.upload(video.thumbnail, {
                    folder: `Learning Platform/${instructorId}/courses/thumbnails`,
                });

                uploadedVideos.push({
                    videoTitle: video.title,
                    videoThumbnail: thumbnailUpload.secure_url,
                    videoUrl: videoUpload.secure_url,
                });
            }
        }

        const newCourse = new courseModel({
            title,
            description,
            price,
            category,
            instructorId,
            thumbnail: thumbnailUrl,
            videos: uploadedVideos,
        });

        await newCourse.save();

        res.status(201).json({
            success: true,
            message: "Course created successfully!",
            course: newCourse,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Upload Videos (after course creation)
export const uploadVideos = async (req, res) => {
    try {
      const { courseId } = req.body;
  
      if (!courseId) {
        return res.status(400).json({ success: false, message: "Course ID is required!" });
      }
  
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: "Course not found!" });
      }
  
      if (!req.files || !req.files.video || !req.files.thumbnail) {
        return res.status(400).json({ success: false, message: "Video and thumbnail are required!" });
      }
  
      let uploadedVideos = [];
  
      for (let i = 0; i < req.files.video.length; i++) {
        // Upload video
        const videoUpload = await cloudinary.v2.uploader.upload(req.files.video[i].path, {
          folder: `Learning Platform/Videos`,
          resource_type: "video",
        });
  
        // Upload thumbnail
        const thumbnailUpload = await cloudinary.v2.uploader.upload(req.files.thumbnail[i].path, {
          folder: `Learning Platform/Thumbnails`,
        });
  
        uploadedVideos.push({
          videoTitle: `Video ${i + 1}`,
          videoThumbnail: thumbnailUpload.secure_url,
          videoUrl: videoUpload.secure_url,
        });
      }
  
      // Push uploaded videos into course
      course.videos.push(...uploadedVideos);
      await course.save();
  
      // ✅ Fix response to avoid `[object Object]` issue
      res.status(200).json({
        success: true,
        message: "Videos uploaded successfully!",
        videos: uploadedVideos, // This will be properly formatted
      });
  
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  

export const getCourseDetails = async (req,res,next) => {
    try {
        const courseId = req.params.id;
        const course = await courseModel.findById(courseId)
        res.json(course);
        } catch (error) {
            res.status(404).json({ success: false, message: "Course not found" });
            }
}

export const deleteCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id; // Extract course ID from request parameters

        const deletedCourse = await courseModel.findByIdAndDelete(courseId); // Delete the course

        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

export const editCourseDetails = async (req, res, next) => {
    try {
        const courseId = req.params.id; // Extract course ID from request parameters
        const updatedData = req.body; // Get updated data from request body

        // Find the course by ID and update it
        const updatedCourse = await courseModel.findByIdAndUpdate(courseId, updatedData, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Course details updated successfully",
            course: updatedCourse,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
