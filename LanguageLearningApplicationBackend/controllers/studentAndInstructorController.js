import userModel from "../models/userModel.js";
import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Additional details of students and instructors
export const additionalDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { bio, github, linkedIn, twitter, mobile, qualification } = req.body;

    console.log("Received Request:", req.body);
    console.log("Received File:", req.file);

    // Find the user
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user details
    if (bio) user.bio = bio;
    if (github) user.socialLinks.github = github;
    if (linkedIn) user.socialLinks.linkedIn = linkedIn;
    if (twitter) user.socialLinks.twitter = twitter;
    if (mobile) user.mobile = mobile;
    if (qualification) user.qualification = qualification;

    // Upload profile picture to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "profile_pictures", // Cloudinary folder
      });

      user.profilePicture = result.secure_url;
      console.log("Profile Picture Uploaded:", result.secure_url);

      
    }

    // Save updated user details
    await user.save();

    res.status(200).json({ success: true, message: "User details updated successfully", user });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ success: false, message: error.message });
  }
  };
