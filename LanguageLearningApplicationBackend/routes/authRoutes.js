import express from "express";
import { register, login, checkAvailability} from "../controllers/authController.js";

const router = express.Router();

router.post("/register",register)
router.post("/login",login)
router.post("/check-availability", checkAvailability); 

export default router;