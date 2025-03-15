import courseModel from "../models/courseModel.js";

import userModel from "../models/userModel.js";


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


// Approve Course
export const approveCourse = async (req, res) => {
  try {
    const course = await courseModel.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.status = "Approved";
    await course.save();

    res.status(200).json({ message: "Course Approved", course });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Reject Course
export const rejectCourse = async (req, res) => {
  try {
    const course = await courseModel.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.status = "Rejected";
    await course.save();

    res.status(200).json({ message: "Course Rejected", course });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};



// Toggle block/unblock user
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

