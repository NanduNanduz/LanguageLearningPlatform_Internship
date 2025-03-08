import express from "express";
import {createCourse} from "../controllers/instructorController.js"

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post("/create-course", createCourse);


export default router;
