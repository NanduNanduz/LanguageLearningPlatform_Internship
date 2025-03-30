import express from "express";
import {
  deleteCourse,
  getInstructorCourses,
  getCourseDetails,
  editCourseDetails,
  createCourse,
  deleteVideoFromCourse,
  updateVideoInCourse,
  addVideosAndResources,
  issueCertificate,
  createQuizQuestions,
  editQuiz,
  editQuizQuestion,
  getQuizzesByCourse,
  getInstuctors,
  deleteResource,
  getEnrolledStudents,
  deleteQuizQuestion,
  getInstructorQuestions,
  postInstructorAnswer,
} from "../controllers/instructorController.js";
import { upload, parseFormData } from "../utils/multer.js";
import { getInstructorDetails } from "../controllers/instructorController.js";
import { verifyToken } from "../middlewares/jwt.js";

const router = express.Router();

router.use(express.json());

router.use(express.urlencoded({ extended: true }));

router.get("/all-Instructors", getInstuctors);

router.get("/single-instructor/:instructorId", getInstructorDetails);

//CreatingCourse
router.post(
  "/createCourse/:instructorId",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videos", maxCount: 10 },
    { name: "videoThumbnails", maxCount: 10 },
  ]),
  createCourse
);

router.delete("/delete-course/:id", deleteCourse); //deletingCourse

router.get("/courseDetails/:instructorId", getInstructorCourses); //instructror courses

router.get("/courseItems/:courseId", getCourseDetails);

router.put(
  "/editCourse/:id",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  editCourseDetails
); //editCourse

router.delete("/delete-video/:courseId/:videoId", deleteVideoFromCourse); //Delete video inside a course

router.put(
  "/updateVideo/:courseId/:videoId", // updating title
  updateVideoInCourse
);

//Adding videos and resources to a course
router.post(
  "/video-resources/:courseId",
  upload.fields([
    { name: "videos", maxCount: 10 },
    { name: "resources", maxCount: 10 },
  ]),
  addVideosAndResources
);

router.post("/issueCertificate/:userId/:courseId", issueCertificate); //certificate issueing

router.post("/createQuiz/:courseId", parseFormData, createQuizQuestions); // create new quiz

// Route to update quiz details and add new questions
router.put("/editQuiz/:quizId", editQuiz);

// Route to edit a specific question inside a quiz
router.put(
  "/editQuestion/:quizId/:questionId",
  parseFormData,
  editQuizQuestion
);

//getting quiz of a course
router.get("/quiz/:courseId", getQuizzesByCourse);

router.delete("/course/:courseId/resource/:resourceId", deleteResource);

//getting enrolled students of a course
router.get("/enrolled-students/:courseId", getEnrolledStudents);

router.delete("/deleteQuestion/:quizId/:questionId", deleteQuizQuestion);

// Get all questions for instructor's course
router.get("/:courseId/questions", verifyToken, getInstructorQuestions);

// Instructor posts an answer
router.post(
  "/:courseId/questions/:questionId/answers",
  verifyToken,
  postInstructorAnswer
);

export default router;
