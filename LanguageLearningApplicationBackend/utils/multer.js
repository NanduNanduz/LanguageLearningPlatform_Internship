import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for course thumbnails
const courseThumbnailStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "Learning Platform/Thumbnails", // Course thumbnails
    resource_type: "image",
  },
});

// Storage for video thumbnails
const videoThumbnailStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "Learning Platform/Video Thumbnails", // Video thumbnails
    resource_type: "image",
  },
});

// Storage for videos
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "Learning Platform/Videos", // Video files
    resource_type: "video",
  },
});

// Multer Uploads
export const uploadCourseThumbnail = multer({ storage: courseThumbnailStorage });
export const uploadVideoThumbnail = multer({ storage: videoThumbnailStorage });
export const uploadVideo = multer({ storage: videoStorage });
