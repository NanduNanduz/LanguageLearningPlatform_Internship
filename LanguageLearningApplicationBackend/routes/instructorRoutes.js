import express from "express";
import {createCourse, deleteCourse, editCourseDetails, getCourseDetails} from "../controllers/instructorController.js"

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post("/create-course", createCourse);
router.delete("/delete-course/:id",deleteCourse);
router.get("/courseDetails/:id",getCourseDetails);
router.put("/editCourse/:id",editCourseDetails);


export default router;
