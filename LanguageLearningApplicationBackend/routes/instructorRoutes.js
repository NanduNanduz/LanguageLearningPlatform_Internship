import express from "express";
import {
  deleteCourse,
  getCourseDetails,
  editCourseDetails,
  createCourse,
  deleteVideoFromCourse,
  updateVideoInCourse
} from "../controllers/instructorController.js";

import { upload } from "../utils/multer.js";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//CreatingCourse
router.post(
    "/createCourse",
    upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "videos", maxCount: 10 },
      { name: "videoThumbnails", maxCount: 10 },
    ]),
    createCourse
  );
router.delete("/delete-course/:id", deleteCourse); //deletingCourse

router.get("/courseDetails/:id", getCourseDetails); //CourseDetails

router.put("/editCourse/:id",upload.fields([{name:"thumbnail", maxCount:1}]),editCourseDetails); //editCourse

router.delete("/delete-video/:courseId/:videoId", deleteVideoFromCourse); //Delete video inside a course

router.put(
  "/updateVideo/:courseId/:videoId",
  upload.fields([{ name: "videoThumbnail", maxCount: 1 }]), // updating title and thumbnail of a video
  updateVideoInCourse
);
  
  
  

export default router;
