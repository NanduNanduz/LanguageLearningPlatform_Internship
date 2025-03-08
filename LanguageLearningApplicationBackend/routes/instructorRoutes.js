import express from "express";
import {
  deleteCourse,
  getCourseDetails,
  editCourseDetails,
  createCourse,
} from "../controllers/instructorController.js";

import { upload } from "../utils/multer.js";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post(
    "/createCourse",
    upload.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "videos", maxCount: 10 },
      { name: "videoThumbnails", maxCount: 10 },
    ]),
    createCourse
  );
router.delete("/delete-course/:id", deleteCourse);
router.get("/courseDetails/:id", getCourseDetails);
router.put("/editCourse/:id", editCourseDetails);

export default router;
