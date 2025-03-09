import courseModel from "../models/courseModel.js";
import cloudinary from "cloudinary";
import { deleteLocalFiles, deleteLocalFilez } from "../utils/multer.js";

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
    const newThumbnail = req.files?.thumbnail?.[0]; // Extract file from array

    // Find the course
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // If a new thumbnail is provided, upload it to Cloudinary
    if (newThumbnail) {
      // Upload new thumbnail to Cloudinary
      const thumbnailUpload = await cloudinary.v2.uploader.upload(newThumbnail.path, {
        folder: "course_thumbnails",
      });

      // **Do NOT delete the old thumbnail from Cloudinary**
      // Just update the course model with the new thumbnail URL
      updatedData.thumbnail = thumbnailUpload.secure_url;

      // Delete the locally uploaded file
      deleteLocalFiles([newThumbnail]);
    }

    // Update the course details
    const updatedCourse = await courseModel.findByIdAndUpdate(courseId, updatedData, { new: true });
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

//Deleting videos inside a course
export const deleteVideoFromCourse = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;

    // Find the course by ID
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Find the video inside the course
    const videoIndex = course.videos.findIndex(video => video._id.toString() === videoId);
    if (videoIndex === -1) {
      return res.status(404).json({ success: false, message: "Video not found in this course" });
    }

    // Extract video details
    const { videoUrl, videoThumbnail } = course.videos[videoIndex];

    // Extract public_id from Cloudinary URLs
    const extractPublicId = (url) => {
      const parts = url.split("/");
      return parts[parts.length - 1].split(".")[0]; // Get the filename without extension
    };

    const videoPublicId = extractPublicId(videoUrl);
    const thumbnailPublicId = extractPublicId(videoThumbnail);

    // Delete video and thumbnail from Cloudinary
    await cloudinary.v2.uploader.destroy(videoPublicId, { resource_type: "video" });
    await cloudinary.v2.uploader.destroy(thumbnailPublicId, { resource_type: "image" });

    // Remove video from the videos array
    course.videos.splice(videoIndex, 1);

    // Save updated course
    await course.save();

    res.status(200).json({ success: true, message: "Video deleted successfully", course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//editing videos inside a course
export const updateVideoInCourse = async (req, res) => {
  const { courseId, videoId } = req.params;
  const newVideoTitle = req.body?.newVideoTitle;
  const videoThumbnail = req.files?.videoThumbnail?.[0]; // Get the first file

  try {
    console.log(`Updating video in course: ${courseId}, Video: ${videoId}`);

    // Validate IDs
    if (!courseId.match(/^[0-9a-fA-F]{24}$/) || !videoId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid courseId or videoId" });
    }

    // Find the course
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Find the video inside the course
    const videoIndex = course.videos.findIndex((v) => v._id.toString() === videoId);
    if (videoIndex === -1) {
      return res.status(404).json({ success: false, message: "Video not found in course" });
    }

    // Update video title if provided
    if (newVideoTitle) {
      course.videos[videoIndex].videoTitle = newVideoTitle;
      console.log("Video title updated");
    }

    // Upload and update new thumbnail if provided
    if (videoThumbnail && videoThumbnail.path) {
      console.log("Uploading new thumbnail...");

      // Upload to Cloudinary
      const thumbnailUpload = await cloudinary.v2.uploader.upload(videoThumbnail.path, {
        folder: "course_video_thumbnails",
      });

      // ✅ Delete old thumbnail from Cloudinary if it exists
      if (course.videos[videoIndex].videoThumbnail) {
        const oldThumbnailPublicId = course.videos[videoIndex].videoThumbnail
          .split("/")
          .pop()
          .split(".")[0];

        await cloudinary.v2.uploader.destroy(`course_video_thumbnails/${oldThumbnailPublicId}`);
        console.log("Old thumbnail deleted from Cloudinary");
      }

      // ✅ Update the video thumbnail URL in the course
      course.videos[videoIndex].videoThumbnail = thumbnailUpload.secure_url;
      console.log("New Thumbnail uploaded");

      // ✅ Delete the local uploaded file
      deleteLocalFilez([videoThumbnail]);
    }

    // Mark the videos array as modified
    course.markModified("videos");

    // Save updated course
    await course.save();

    res.status(200).json({ success: true, message: "Video updated successfully", course });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};