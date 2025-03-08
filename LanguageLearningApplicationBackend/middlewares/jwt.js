import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js"; // Adjust path based on your structure

// Middleware to verify JWT token and authenticate user
export const verifyToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer <token>"

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized access: No token provided" });
        }

        // Verify JWT
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload) {
            return res.status(401).json({ success: false, message: "Unauthorized access: Invalid token" });
        }

        // Fetch user from database and attach to req.user
        const user = await UserModel.findById(payload.id).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user; // Attach user object to request
        next(); // Proceed to the next middleware or controller
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized access", error: error.message });
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
