import express from "express";
import {
  deleteCourse,
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
  getQuizzesByCourse
} from "../controllers/instructorController.js";

import { upload , parseFormData} from "../utils/multer.js";
import { getInstructorDetails } from "../controllers/instructorController.js";


const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));



router.get("/single-instructor/:instructorId", getInstructorDetails);


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
  
router.post(                        
  "/video-resources/:courseId",
  upload.fields([
    { name: "videos", maxCount: 10 }, 
    { name: "videoThumbnails", maxCount: 10 }, 
    { name: "resources", maxCount: 10 } 
  ]),
  addVideosAndResources
);                                     //Adding videos and resources to a course
  
router.post("/issueCertificate/:userId/:courseId", issueCertificate);   //certificate issueing

router.post("/createQuiz/:courseId",parseFormData,createQuizQuestions); // create new quiz

// Route to update quiz details and add new questions
router.put("/editQuiz/:quizId", editQuiz);

// Route to edit a specific question inside a quiz
router.put("/editQuestion/:quizId/:questionId",parseFormData, editQuizQuestion);

//getting quiz of a course
router.get("/quiz/:courseId", getQuizzesByCourse);


export default router;
