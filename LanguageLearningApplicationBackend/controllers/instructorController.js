import courseModel from "../models/courseModel.js";
import cloudinary from "cloudinary"; // Import Cloudinary SDK

// Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createCourse = async (req, res, next) => {
    try {
        const { title, description, price, category, thumbnail, videos, instructorId, resources = [] } = req.body;

        // Create a new course instance
        const newCourse = new courseModel({
            title,
            description,
            price,
            category,
            thumbnail,
            instructorId,
            videos,
            resources,
        });

        // Save the course to the database
        await newCourse.save();

        // Create a folder in Cloudinary with the instructorId
        await cloudinary.v2.api.create_folder(`Learning Platform/${newCourse.instructorId}`);

        // Send success response
        res.status(201).json({
            success: true,
            message: "Course created successfully",
            course: newCourse,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

export const deleteCourse = async (req,res,next) =>{
    
}