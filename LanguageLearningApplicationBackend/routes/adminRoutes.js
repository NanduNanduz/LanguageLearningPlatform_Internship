import express from "express";
import { allPayment, approveCourse, blockInstructor, courseDetails, deleteInstructor, getRefundRequests, processRefund,  rejectCourse, sendAnnouncement } from "../controllers/adminController.js"; 
import adminAuth from "../middlewares/adminAuth.js";
import { getCourses } from "../controllers/adminController.js";
import { toggleBlockUser } from "../controllers/adminController.js";
import { deleteStudent } from "../controllers/adminController.js";
import { verifyToken } from "../middlewares/jwt.js";



const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/courses", getCourses); 

// Approve a course
router.put("/approve-course/:id", approveCourse);

// Reject a course
router.put("/reject-course/:id",rejectCourse);

// Route to block/unblock a student
router.put("/block-student/:userId", toggleBlockUser);

router.delete("/delete-student/:id", deleteStudent);

router.delete("/delete-instructor/:id", deleteInstructor);


// Block/Unblock instructor
router.put("/block-instructor/:id", blockInstructor);

router.get("/courseDetails/:courseId", courseDetails);

// Fetch all payments
router.get("/payments", allPayment);

// Refund a payment
// router.post("/payments/refund/:id", refundPayment);

router.get("/payments/refund-requests", getRefundRequests);
router.post("/payments/process-refund/:id", processRefund);


// Send announcement (Admin only)
router.post("/sendAnnouncement", verifyToken, sendAnnouncement);









export default router;
