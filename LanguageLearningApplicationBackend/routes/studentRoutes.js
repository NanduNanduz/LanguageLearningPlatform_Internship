import express from "express";
import { enrollCourse, getAllNotifications, getCourseProgress, getEnrolledCourses, getReviewsForCourse, getStudentDetails, getUserQuizResults, submitQuiz, submitReview, updateVideoProgress, uploadAssignment, verifyPayment } from "../controllers/studentController.js";
import {getUserDetails} from "../controllers/studentController.js";
import { getAllStudents , getQuizByCourse, getApprovedCourses} from "../controllers/studentController.js";
import {upload, parseFormData } from "../utils/multer.js";
import { verifyToken } from "../middlewares/jwt.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/single-user/:userId", getUserDetails);
router.post("/enroll/:courseId/:studentId", enrollCourse);


router.get("/all-students", getAllStudents);
router.get("/quiz/:courseId",getQuizByCourse );
router.post("/submitquiz",parseFormData,submitQuiz);
router.get("/quizResults/:userId/:courseId",getUserQuizResults);
router.get("/studentDetails/:studentId", getStudentDetails);
router.get("/approved-courses", getApprovedCourses);
router.get("/verify-payment", verifyPayment);
router.get("/enrolledCourse/:studentId", getEnrolledCourses);
router.get("/notifications",verifyToken, getAllNotifications);
router.post("/upload/:studentId/:courseId", upload.single("assignment") ,uploadAssignment);
router.post("/updateProgress", updateVideoProgress);
router.get("/:userId/progress/:courseId", getCourseProgress);
router.post("/submit-review", verifyToken, submitReview);
router.get("/reviews/:courseId", getReviewsForCourse);




export default router;





