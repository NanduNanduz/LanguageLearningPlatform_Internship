import express from "express";
import { enrollCourse, getStudentDetails, getUserQuizResults, submitQuiz } from "../controllers/studentController.js";
import {getUserDetails} from "../controllers/studentController.js";
import { getAllStudents , getQuizByCourse} from "../controllers/studentController.js";
import { parseFormData } from "../utils/multer.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/single-user/:userId", getUserDetails);
router.put("/enroll/:courseId", enrollCourse);
router.get("/all-students", getAllStudents);
router.get("/quiz/:courseId",getQuizByCourse )
router.post("/submitquiz",parseFormData,submitQuiz)
router.get("/quizResults/:userId/:courseId",getUserQuizResults)
router.get("/studentDetails/:studentId", getStudentDetails)

export default router;
