import express from "express";
import { approveCourse, blockInstructor, courseDetails, rejectCourse } from "../controllers/adminController.js"; 
import adminAuth from "../middlewares/adminAuth.js";
import { getCourses } from "../controllers/adminController.js";
import { toggleBlockUser } from "../controllers/adminController.js";
import { deleteStudent } from "../controllers/adminController.js";



const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/courses", getCourses); 

// Approve a course
router.put("/course-approve/:id", approveCourse);

// Reject a course
router.put("/course-reject/:id",rejectCourse);

// Route to block/unblock a student
router.put("/block-student/:userId", toggleBlockUser);

router.delete("/delete-student/:id", deleteStudent);

// Block/Unblock instructor
router.put("/block-instructor/:id", blockInstructor);

router.get("/courseDetails/:courseId", courseDetails);





export default router;
