import express from "express";
import { enrollCourse } from "../controllers/studentController.js";
import {getUserDetails} from "../controllers/studentController.js"
// import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/single-user/:userId", getUserDetails);
router.put("/enroll/:courseId", enrollCourse);

export default router;
