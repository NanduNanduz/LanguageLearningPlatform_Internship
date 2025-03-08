import express from "express";
import {
  createCourse,
  deleteCourse,
  editCourseDetails,
  getCourseDetails,
  uploadVideos,
} from "../controllers/instructorController.js";
import { uploadCourseThumbnail, uploadVideoThumbnail, uploadVideo as videoUpload } from "../utils/multer.js";


const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post(
  "/create-course",uploadCourseThumbnail.single("thumbnail"),
  createCourse
);
router.post('/video-upload',videoUpload.fields([{ name: "video", maxCount: 10 },
    { name: "thumbnail", maxCount: 10 }]),uploadVideos)

router.delete("/delete-course/:id", deleteCourse);
router.get("/courseDetails/:id", getCourseDetails);
router.put("/editCourse/:id", editCourseDetails);

export default router;
