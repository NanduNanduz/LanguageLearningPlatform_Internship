import express from "express";
import {createCourse, deleteCourse} from "../controllers/instructorController.js"

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post("/create-course", createCourse);
router.delete("/delete-course/:id",deleteCourse);


export default router;
