import express from "express";
import { enrollCourse } from "../controllers/studentController.js";
// import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Student enrollment route
router.put("/enroll/:courseId", enrollCourse);

export default router;
