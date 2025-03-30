import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js"; // Adjust path based on your structure

//------------------------ Middleware To Verify JWT Token And Authenticate User---------------------------------------

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    console.log("Decoded user:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ error: "Invalid token." });
  }
};

//----------------------------------------- Middleware To Check User Role--------------------------------------------------
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Access denied: Unauthorized role" });
    }
    next();
  };
};
