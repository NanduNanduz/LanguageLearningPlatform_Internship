import express from "express";
import { approveCourse, rejectCourse } from "../controllers/adminController.js"; 
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Approve a course
router.put("/course-approve/:id", approveCourse);

// Reject a course
router.put("/course-reject/:id",rejectCourse);

export default router;
