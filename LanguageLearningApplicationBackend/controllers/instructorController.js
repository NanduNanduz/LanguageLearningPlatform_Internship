import courseModel from "../models/courseModel.js";

export const createCourse = async (req, res, next) => {
    try {
        const { title, description, price, category, thumbnail, videos, resources } = req.body;

        // Create a new course instance
        const newCourse = new courseModel({
            title,
            description,
            price,
            category,
            thumbnail,
            instructorId : req.user,
            videos,
            resources,
        });

        // Save the course to the database
        await newCourse.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course: newCourse,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
} 