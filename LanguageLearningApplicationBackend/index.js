// import express from "express";
// import morgan from "morgan";
// import cors from "cors";
// import dotenv from "dotenv";
// import db from "./config/db.js";
// import authRoutes from "./routes/authRoutes.js";
// import instructorRoutes from "./routes/instructorRoutes.js";
// import studentAndInstructorRoutes from "./routes/studentAndInstructorRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";
// import studentRoutes from "./routes/studentRoutes.js";
// import { createServer } from "http";
// import setupSocket from "./utils/socket.js";

// // Initialize dotenv and express
// dotenv.config();

// const app = express();

// // Middleware
// app.use(morgan("dev"));

// app.use(
//   cors({
//     origin: "http://localhost:5173", // Allow requests from the frontend origin
//     credentials: true, // Allow credentials (if needed)
//   })
// );

// app.use(express.json());

// app.use(express.urlencoded({ extended: true }));

// // Database connection
// db();

// // Create HTTP server and setup Socket.io
// const server = createServer(app);

// const io = setupSocket(server);

// // Attach io to the request object
// app.use((req, res, next) => {
//   console.log("Attaching io to req object");
//   req.io = io;
//   next();
// });


// app.use("/auth", authRoutes);

// app.use("/instructor", instructorRoutes);

// app.use("/user", studentAndInstructorRoutes);

// app.use("/admin", adminRoutes);

// app.use("/student", studentRoutes);

// // Start the server
// server.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });


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

// // Define allowed origins
// const allowedOrigins = [
//   "http://localhost:5173", // Local development
//   "https://language-learning-platform-internship-yiok.vercel.app", // Your frontend
//   "https://language-learning-platform-internship.vercel.app", // Your backend
// ];

const allowedOrigins = [
  "http://localhost:5173",
  "https://language-learning-platform-internship-yiok.vercel.app",
  "https://language-learning-platform-internship.vercel.app",
  "https://language-learning-platform-internship-yiok-1cv9w8nib.vercel.app", // New subdomain
];



// Middleware
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("🔍 Incoming Request Origin:", req.headers.origin);
  next();
});


// Enhanced CORS configuration
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       console.log("Request Origin:", origin);
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, origin); // ✅ Set the correct origin dynamically
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );


app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🔥 CORS Middleware Received Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, origin); // ✅ Return the correct origin dynamically
      }
      return callback(new Error("❌ Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
db();

// Create HTTP server
const server = createServer(app);

// Setup Socket.io with your existing configuration
const io = setupSocket(server);

// Attach io to the request object
app.use((req, res, next) => {
  console.log("Attaching io to req object");
  req.io = io;
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/instructor", instructorRoutes);
app.use("/user", studentAndInstructorRoutes);
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
});