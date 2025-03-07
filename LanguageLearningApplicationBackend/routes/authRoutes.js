import express from "express";
import { register, login, resetPassword, verifyOtp, newPass } from "../controllers/authController.js";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post("/register", register);
router.post("/login", login);
router.post('/reset-password', resetPassword);
router.post('/verifyOtp',verifyOtp)
router.post('/newPass',newPass)


export default router;
