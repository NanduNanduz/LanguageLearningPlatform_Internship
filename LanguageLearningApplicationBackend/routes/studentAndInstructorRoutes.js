import express from "express";
import {
  additionalDetails,
  getProfile,
} from "../controllers/studentAndInstructorController.js";
import { upload } from "../utils/multer.js";

const router = express.Router();

// Route for updating user details (with profile picture upload)
router.put(
  "/updateUser/:id",
  upload.single("profilePicture"),
  additionalDetails
);

router.get("/profile/:id", getProfile);

export default router;
