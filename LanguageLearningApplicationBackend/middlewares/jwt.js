import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js"; // Adjust path based on your structure

// Middleware to verify JWT token and authenticate user
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY); // Verify the token
    console.log("Decoded user:", decoded); // Debugging log
    req.user = decoded; // Attach the decoded user data to req.user
    next();
  } catch (error) {
    console.error("Token verification failed:", error); // Debugging log
    res.status(401).json({ error: "Invalid token." });
  }
};
// Middleware to check user role
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, message: "Access denied: Unauthorized role" });
        }
        next();
    };
};
