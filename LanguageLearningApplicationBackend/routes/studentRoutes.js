import express from "express";
import { enrollCourse, getEnrolledCourses, getStudentDetails, getUserQuizResults, submitQuiz } from "../controllers/studentController.js";
import {getUserDetails} from "../controllers/studentController.js";
import { getAllStudents , getQuizByCourse, getApprovedCourses} from "../controllers/studentController.js";
import { parseFormData } from "../utils/multer.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/single-user/:userId", getUserDetails);
router.post("/enroll/:courseId/:studentId", enrollCourse);
router.get("/all-students", getAllStudents);
router.get("/quiz/:courseId",getQuizByCourse )
router.post("/submitquiz",parseFormData,submitQuiz)
router.get("/quizResults/:userId/:courseId",getUserQuizResults)
router.get("/studentDetails/:studentId", getStudentDetails)
router.get("/approved-courses", getApprovedCourses);
router.get("/enrolledCourse/:studentId", getEnrolledCourses);


export default router;
