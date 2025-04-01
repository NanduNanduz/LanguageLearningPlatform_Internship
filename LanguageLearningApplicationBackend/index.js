import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import instructorRoutes from "./routes/instructorRoutes.js";
import studentAndInstructorRoutes from "./routes/studentAndInstructorRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import { createServer } from "http";
import setupSocket from "./utils/socket.js";

// Initialize dotenv and express
dotenv.config();

const app = express();

// Middleware
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from the frontend origin
    credentials: true, // Allow credentials (if needed)
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Database connection
db();

// Create HTTP server and setup Socket.io
const server = createServer(app);

const io = setupSocket(server);

// Attach io to the request object
app.use((req, res, next) => {
  console.log("Attaching io to req object");
  req.io = io;
  next();
});


app.use("/auth", authRoutes);

app.use("/instructor", instructorRoutes);

app.use("/user", studentAndInstructorRoutes);

app.use("/admin", adminRoutes);

app.use("/student", studentRoutes);

// Start the server
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
