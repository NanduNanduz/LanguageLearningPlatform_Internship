import courseModel from "../models/courseModel.js";

import userModel from "../models/userModel.js";
 import paymentModel from "../models/paymentModel.js";
 import notificationModel from "../models/notificationModel.js"




// Get all courses (for admin panel)
export const getCourses = async (req, res) => {
  try {
    const courses = await courseModel
      .find()
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const courseDetails =  async (req, res) => {
  try {
    const course = await courseModel.findById(req.params.courseId).populate(
      "videos"
    );
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error("Error fetching course details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// Approve Course
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

// Reject Course
export const rejectCourse =  async (req, res) => {
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



//  block/unblock user
export const toggleBlockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Toggle the blocked status
    user.blocked = user.blocked === "no" ? "yes" : "no";
    await user.save();

    res
      .status(200)
      .json({
        message: `User ${user.blocked === "yes" ? "Blocked" : "Unblocked"}`,
        user,
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};




export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete student
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



// Block/Unblock instructor
export const blockInstructor = async (req, res) => {
  const instructor = await userModel.findById(req.params.id);
  instructor.blocked = req.body.blocked;
  await instructor.save();
  res.json({ message: "Instructor status updated" });
};


export const allPayment = async (req, res) => {
  try {
    const payments = await paymentModel.find()
      .populate("studentId", "name email") // Populate student details
      .populate("courseId", "title"); // Populate course details
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};
export const refundPayment = async (req, res) => {
  try {
    const payment = await paymentModel.findById(req.params.id);
    if (!payment || payment.paymentStatus !== "Completed") {
      return res.status(400).json({ message: "Refund not possible" });
    }

    // Refund logic using Stripe API
    await stripe.refunds.create({ payment_intent: payment.transactionId });

    // Update payment status and refund status
    payment.paymentStatus = "Refunded";
    payment.refundIssued = true;
    await payment.save();

    res.json({ message: "Refund issued successfully" });
  } catch (error) {
    console.error("Refund failed:", error);
    res.status(500).json({ error: "Refund failed" });
  }
};


export const sendAnnouncement = async (req, res) => {
  try {
    console.log("req.io:", req.io); // Debugging log
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

