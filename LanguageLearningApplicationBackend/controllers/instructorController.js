import courseModel from "../models/courseModel.js";
import cloudinary from "cloudinary";
import userModel from "../models/userModel.js";
import streamifier from "streamifier";
import PDFDocument from "pdfkit";

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

      // Just update the course model with the new thumbnail URL
      updatedData.thumbnail = thumbnailUpload.secure_url;

      
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
    const { title, description, price, category, instructorId } = req.body;

    if (!req.files || !req.files.thumbnail) {
      return res.status(400).json({ success: false, message: "Course thumbnail is required" });
    }

    // Upload course thumbnail
    const thumbnailUpload = await cloudinary.v2.uploader.upload(req.files.thumbnail[0].path, {
      folder: "course_thumbnails",
    });

    let videoUploads = []; 

    // Convert videoTitle to an array if it's a single string
    let videoTitles = req.body.videoTitle;
    if (typeof videoTitles === "string") {
      videoTitles = [videoTitles]; // Convert to array
    }

    if (req.files.videos && req.files.videos.length > 0) {
      if (!Array.isArray(videoTitles) || videoTitles.length !== req.files.videos.length) {
        return res.status(400).json({ success: false, message: "Each video must have a corresponding title" });
      }

      if (!req.files.videoThumbnails || req.files.videoThumbnails.length !== req.files.videos.length) {
        return res.status(400).json({ success: false, message: "Each video must have a corresponding thumbnail" });
      }

      videoUploads = await Promise.all(req.files.videos.map(async (videoFile, index) => {
        const videoThumbnailUpload = await cloudinary.v2.uploader.upload(req.files.videoThumbnails[index].path, {
          folder: "course_video_thumbnails",
        });

        const videoUpload = await cloudinary.v2.uploader.upload(videoFile.path, {
          folder: "course_videos",
          resource_type: "video",
        });

        return {
          videoTitle: videoTitles[index] || "Untitled Video", 
          videoThumbnail: videoThumbnailUpload.secure_url,
          videoUrl: videoUpload.secure_url,
        };
      }));
    }

    const newCourse = new courseModel({
      title,
      price,
      category,
      description,
      thumbnail: thumbnailUpload.secure_url,
      instructorId,
      videos: videoUploads,
      status: "Pending", 
    });

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

//adding videos and assignments as pdf after creating course
export const addVideosAndResources = async (req, res) => {
  try {
    const { courseId } = req.params;
    let { videoTitle, resourceName } = req.body;

    // Find the course
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    let videoUploads = [];
    let resourceUploads = [];

    // Convert videoTitle to an array if it's a single string
    if (typeof videoTitle === "string") {
      videoTitle = [videoTitle];
    }

    // Convert resourceName to an array if it's a single string
    if (typeof resourceName === "string") {
      resourceName = [resourceName];
    }

    // Upload videos (if provided)
    if (req.files.videos && req.files.videos.length > 0) {
      if (!Array.isArray(videoTitle) || videoTitle.length !== req.files.videos.length) {
        return res.status(400).json({ success: false, message: "Each video must have a corresponding title" });
      }

      if (!req.files.videoThumbnails || req.files.videoThumbnails.length !== req.files.videos.length) {
        return res.status(400).json({ success: false, message: "Each video must have a corresponding thumbnail" });
      }

      videoUploads = await Promise.all(req.files.videos.map(async (videoFile, index) => {
        const videoThumbnailUpload = await cloudinary.v2.uploader.upload(req.files.videoThumbnails[index].path, {
          folder: "course_video_thumbnails",
        });

        const videoUpload = await cloudinary.v2.uploader.upload(videoFile.path, {
          folder: "course_videos",
          resource_type: "video",
        });

        return {
          videoTitle: videoTitle[index] || "Untitled Video",
          videoThumbnail: videoThumbnailUpload.secure_url,
          videoUrl: videoUpload.secure_url,
        };
      }));
    }

    // Upload resources (PDFs) (if provided)
    if (req.files.resources && req.files.resources.length > 0) {
      if (!Array.isArray(resourceName) || resourceName.length !== req.files.resources.length) {
        return res.status(400).json({ success: false, message: "Each resource must have a corresponding name" });
      }

      resourceUploads = await Promise.all(req.files.resources.map(async (pdfFile, index) => {
        const pdfUpload = await cloudinary.v2.uploader.upload(pdfFile.path, {
          folder: "course_resources",
          resource_type: "raw",
        });

        return {
          resourceName: resourceName[index] || "Unnamed Resource",
          resourceUrl: pdfUpload.secure_url,
        };
      }));
    }

    // Update the course with new videos and resources
    course.videos.push(...videoUploads);
    course.resources.push(...resourceUploads);
    await course.save();

    res.status(200).json({ success: true, message: "Videos and resources added successfully", course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//generating certificate
export const generateCertificate = async (userName, courseTitle) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: [842, 595], margin: 50 }); // Landscape A4
      let buffers = [];

      // Collect PDF chunks
      doc.on("data", (chunk) => buffers.push(chunk));
      doc.on("end", async () => {
        const pdfBuffer = Buffer.concat(buffers);

        // Upload to Cloudinary
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "raw", folder: "certificates", format: "pdf" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return reject(error);
            }
            resolve(result.secure_url); // Return the certificate URL
          }
        );

        // Convert buffer to readable stream and upload
        streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
      });

      // Background Gradient (light blue to white)
      const gradient = doc.linearGradient(0, 0, 842, 595);
      gradient.stop(0, "#dfe9f3").stop(1, "#ffffff"); // Light blue to white
      doc.rect(0, 0, 842, 595).fill(gradient);

      // Border Design
      doc.rect(20, 20, 802, 555).lineWidth(8).stroke("#003366"); // Dark blue border

      // Decorative Lines
      doc.moveTo(50, 80).lineTo(792, 80).lineWidth(3).stroke("#003366"); // Top line
      doc.moveTo(50, 515).lineTo(792, 515).lineWidth(3).stroke("#003366"); // Bottom line


      // Certificate Title
      doc
        .font("Helvetica-Bold")
        .fontSize(34)
        .fillColor("#003366")
        .text("Certificate of Completion", 0, 110, { align: "center" });

      // Subtitle
      doc
        .font("Helvetica")
        .fontSize(18)
        .fillColor("#333")
        .text("This is to certify that", 0, 170, { align: "center" });

      // User's Name
      doc
        .font("Helvetica-Bold")
        .fontSize(26)
        .fillColor("#0056b3")
        .text(userName, 0, 210, { align: "center", underline: true });

      // Course Title
      doc
        .font("Helvetica")
        .fontSize(18)
        .fillColor("#333")
        .text("has successfully completed the course", 0, 260, { align: "center" });

      doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .fillColor("#d9534f")
        .text(courseTitle, 0, 300, { align: "center", underline: true });

      // Issue Date
      doc
        .font("Helvetica")
        .fontSize(14)
        .fillColor("#555")
        .text("Issued on: " + new Date().toDateString(), 0, 350, { align: "center" });

      // Signature Placeholder
      doc
        .moveTo(250, 450)
        .lineTo(400, 450)
        .lineWidth(2)
        .stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text("Authorized Signature", 250, 460, { align: "center" });

        doc.image("./uploads/signature.png", 250, 420, { width: 120 });

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#fff")
        .text("Official Seal", 670, 390, { align: "right" });

        doc.image("./uploads/preview.jpg", 650, 420, { width: 100 }); // Replace with actual seal image


      // Finalize PDF document
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

//certificate issue
export const issueCertificate = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    // Find user and course
    const user = await userModel.findById(userId);
    const course = await courseModel.findById(courseId);
    if (!user || !course) {
      return res.status(404).json({ success: false, message: "User or Course not found" });
    }

    // Generate and upload certificate (returns Cloudinary URL)
    const certificateUrl = await generateCertificate(user.name, course.title);

    // Store certificate details in the user's document
    const userCertificate = { courseId, certificateUrl };
    if (!user.certificates) {
      user.certificates = [];
    }
    user.certificates.push(userCertificate);

    // Store certificate details in the course's document
    const courseCertificate = { userId, certificateUrl };
    if (!course.issuedCertificates) {
      course.issuedCertificates = [];
    }
    course.completedStudents.push(courseCertificate);

    // Save both models
    await user.save();
    await course.save();

    res.status(200).json({
      success: true,
      message: "Certificate issued successfully",
      certificateUrl,
    });
  } catch (error) {
    console.error("Error issuing certificate:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};