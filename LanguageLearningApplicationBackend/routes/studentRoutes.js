import express from "express";
import { checkRefundEligibility, enrollCourse, findUserPayment, getAllNotifications, getCourseProgress, getEnrolledCourses, getRefundStatus, getReviewsForCourse, getStudentDetails, getUserQuizResults, requestRefund, searchCoursesByCategory, searchCoursesByName, submitQuiz, submitReview, updateVideoProgress, uploadAssignment, verifyPayment } from "../controllers/studentController.js";
import {getUserDetails} from "../controllers/studentController.js";
import { getAllStudents , getQuizByCourse, getApprovedCourses} from "../controllers/studentController.js";
import {upload, parseFormData } from "../utils/multer.js";
import {
  postQuestion,
  postAnswer,
  getCourseQuestions,
  upvoteAnswer,
  markAsResolved,
} from "../controllers/studentController.js";
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
router.get("/search/category/:category", searchCoursesByCategory);
router.get("/search/name/:name", searchCoursesByName);
// Post a new question
router.post("/:courseId/questions", verifyToken, postQuestion);

// Post an answer to a question
router.post("/:courseId/questions/:questionId/answers", verifyToken, postAnswer);

// Get all questions for a course
router.get("/:courseId/questions", verifyToken, getCourseQuestions);

// Upvote an answer
router.post("/answers/:answerId/upvote", verifyToken, upvoteAnswer);

// Mark question as resolved
router.put("/questions/:questionId/resolve", verifyToken, markAsResolved);

router.get('/eligibility/:userId/:courseId', checkRefundEligibility);

router.put('/:paymentId/request-refund', requestRefund);

router.get('/:paymentId/refund-status', getRefundStatus);

router.get('/find/:userId/:courseId', findUserPayment);





export default router;





