import courseModel from "../models/courseModel.js";
import userModel from "../models/userModel.js";
import paymentModel from "../models/paymentModel.js";
import notificationModel from "../models/notificationModel.js";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

//---------------- Get all courses (for admin panel)-----------------------------------
export const getCourses = async (req, res) => {
  try {
    const courses = await courseModel.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

//------------------------------------ Get Specific Courses ------------------------------------------
export const courseDetails = async (req, res) => {
  try {
    const course = await courseModel
      .findById(req.params.courseId)
      .populate("videos");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//--------------------------------Approve Course By Admin----------------------------------------
export const approveCourse = async (req, res) => {
  try {
    const course = await courseModel.findByIdAndUpdate(
      req.params.id,
      { status: "Approved" },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course approved successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//-----------------------------------------Reject Course By Admin----------------------------------
export const rejectCourse = async (req, res) => {
  try {
    const course = await courseModel.findByIdAndUpdate(
      req.params.id,
      { status: "Rejected" },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course rejected successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

//-----------------------------------Block/Unblock Student By Admin-----------------------------------
export const toggleBlockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.blocked = user.blocked === "no" ? "yes" : "no";
    await user.save();
    res.status(200).json({
      message: `User ${user.blocked === "yes" ? "Blocked" : "Unblocked"}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

//-------------------------------Find and Delete Student By Admin---------------------------------------
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await userModel.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//----------------------------------Find and Delete Instructor By Admin-------------------------------
export const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;

    const instructor = await userModel.findOne({ _id: id, role: "instructor" });
    if (!instructor) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Delete all courses created by this instructor
    if (instructor.courseCreated && instructor.courseCreated.length > 0) {
      const courseIds = instructor.courseCreated.map((c) => c.courseId);
      await courseModel.deleteMany({ _id: { $in: courseIds } });
    }
    // Then delete the instructor
    await userModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Instructor and their courses deleted successfully" });
  } catch (error) {
    console.error("Error deleting instructor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//--------------------------------Block/Unblock Instructor By Admin-----------------------------------
export const blockInstructor = async (req, res) => {
  const instructor = await userModel.findById(req.params.id);
  instructor.blocked = req.body.blocked;
  await instructor.save();
  res.json({ message: "Instructor status updated" });
};

// All Transactions of Students
export const allPayment = async (req, res) => {
  try {
    const payments = await paymentModel
      .find()
      .populate("studentId", "name email") // Populate student details
      .populate("courseId", "title"); // Populate course details
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

//---------------------------------Send Announcement to All Students By Admin---------------------------
export const sendAnnouncement = async (req, res) => {
  try {
    console.log("req.io:", req.io);
    const { title, message } = req.body;
    // Check if req.user is defined
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "User not authenticated." });
    }
    // Fetch all users from the database
    const users = await userModel.find({}, { _id: 1 }); // Only fetch _id field
    const recipientIds = users.map((user) => user._id); // Extract ObjectId of each user
    // Create a new notification
    const notification = new notificationModel({
      title,
      message,
      recipients: recipientIds, // Save all user IDs as recipients
      sentBy: req.user._id, // Admin who sent the notification
    });

    await notification.save();

    // Send real-time notifications (using WebSocket)
    req.io.emit("new-notification", notification); // Use req.io to emit the event

    res.status(201).json({ message: "Announcement sent successfully" });
  } catch (error) {
    console.error("Error sending announcement:", error);
    res.status(500).json({ error: "Failed to send announcement" });
  }
};

//----------------------------------------------Get Refund Requests------------------------------
export const getRefundRequests = async (req, res) => {
  try {
    const requests = await paymentModel
      .find({ refundStatus: "Requested" })
      .populate("studentId", "name email")
      .populate("courseId", "title");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch refund requests" });
  }
};

// ------------------------------------------Process Refund Request----------------------------------
export const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body; // action: 'approve' or 'reject'

    const payment = await paymentModel.findById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.refundStatus !== "Requested") {
      return res.status(400).json({ message: "Refund not in requested state" });
    }

    if (action === "approve") {
      // Process Stripe refund
      await stripe.refunds.create({ payment_intent: payment.transactionId });

      payment.refundStatus = "Completed";
      payment.paymentStatus = "Refunded";
      payment.refundIssued = true;
      payment.refundProcessedDate = new Date();
    } else {
      payment.refundStatus = "Rejected";
      if (reason) payment.refundReason = reason;
    }

    await payment.save();
    res.json({ message: `Refund ${action}ed successfully` });
  } catch (error) {
    console.error("Refund processing failed:", error);
    res.status(500).json({ error: "Refund processing failed" });
  }
};
