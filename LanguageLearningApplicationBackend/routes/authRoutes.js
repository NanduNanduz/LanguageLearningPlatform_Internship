import express from "express";
import { register, login} from "../controllers/authController.js";

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.post("/register", register);
router.post("/login", login);


export default router;
