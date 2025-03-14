import userModel from "../models/userModel.js";
import OtpModel from "../models/OtpModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"; // Import nodemailer for sending emails
import crypto from "crypto"; // Import crypto for generating OTP

//SIGNUP
export const register = async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }


  // Check if the email already exists
  const existingEmail = await userModel.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ message: "Email already registered." });
  }

  try {
    // Hash the password using bcrypt (async version)
    const hash = await bcrypt.hash(password, 5);

    // Create a new user with hashed password
    const newUser = new userModel({
      name,
      email,
      password: hash,
      role // Store the hashed password
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User has been created" });
  } catch (err) {
    next(err);
  }
};

//LOGIN FUNCTIONALITY
export const login = async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "not found" });
  }

  try {
    const isCorrect = await bcrypt.compare(req.body.password, user.password);
    if (isCorrect) {
      const payload = { Email: user.email, password: user.password };
      const token = jwt.sign(payload, process.env.JWT_KEY);
      return res.status(200).send({ user: user, token: token });
    } else {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Invalid Login" });
  }
};

//RESET PASSWORD
export const resetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Check if the email exists in the database
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    // Delete any existing OTP for this email
    await OtpModel.deleteMany({ email });

    // Generate a new OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP

    // Store new OTP in the database
    const emailEntry = new OtpModel({ email, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }); // Expires in 10 minutes
    await emailEntry.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Error sending OTP. Please try again later." });
      }
      return res.status(200).json({ message: "OTP sent successfully. Check your email." });
    });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};

//VERIFY OTP
export const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;

  // Check if the OTP and email exist in the database
  const emailEntry = await OtpModel.findOne({ email, otp });
  if (!emailEntry) {
    return res.status(400).json({ message: "Invalid OTP or email." });
  }

  // Check if the OTP is still valid
  const isExpired = new Date() > emailEntry.expiresAt;
  if (isExpired) {
    return res.status(400).json({ message: "OTP has expired." });
  }

  return res.status(200).json({ message: "OTP verified successfully." });
};

//NEW PASSWORD
export const newPass = async (req, res, next) => {
  const { email, newPassword, newConfirmPassword } = req.body;

  // Check if newPassword and newConfirmPassword match
  if (newPassword !== newConfirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  // Find the user by email
  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 5);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    next(err);
  }
};
