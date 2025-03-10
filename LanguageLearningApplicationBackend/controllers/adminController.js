import courseModel from "../models/courseModel.js";

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
