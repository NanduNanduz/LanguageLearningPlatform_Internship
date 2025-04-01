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
//     origin: "http://localhost:5173", 
//     credentials: true, 
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

// Initialize environment variables
dotenv.config();

const app = express();

// Render-specific configuration
const allowedOrigins = [
  "https://languagelearningplatform-frontend.onrender.com", // Production frontend
  "https://languagelearningplatform-internship.onrender.com", // Production backend
  "http://localhost:5173", // Local development
];

// Enhanced CORS configuration for Render
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server calls)
    if (!origin) return callback(null, true);

    // Check against allowed origins
    if (
      allowedOrigins.some(
        (allowedOrigin) =>
          origin === allowedOrigin ||
          origin.startsWith(allowedOrigin.replace("https://", "http://"))
      )
    ) {
      return callback(null, true);
    }

    console.error(`CORS blocked for origin: ${origin}`);
    return callback(new Error(`Origin ${origin} not allowed by CORS`), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-HTTP-Method-Override",
  ],
  exposedHeaders: [
    "Content-Length",
    "X-Request-Id",
    "X-Powered-By",
    "X-RateLimit-Limit",
  ],
  maxAge: 86400, // 24 hours
};

// Middleware setup
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight support

// Enhanced request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log("Origin:", req.headers.origin || "none");
  console.log("Headers:", req.headers);
  next();
});

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Database connection
db();

// HTTP server with enhanced WebSocket support
const server = createServer(app);

// Socket.io with Render-specific timeout handling
const io = setupSocket(server);

// Attach Socket.io to requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use("/auth", authRoutes);
app.use("/instructor", instructorRoutes);
app.use("/user", studentAndInstructorRoutes);
app.use("/admin", adminRoutes);
app.use("/student", studentRoutes);

// Enhanced health check endpoint
app.get("/health", (req, res) => {
  const healthcheck = {
    status: "healthy",
    timestamp: Date.now(),
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    dbStatus: "connected", // Add your DB health check here
  };
  res.status(200).json(healthcheck);
});

// Render-specific error handling
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.stack}`);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong!"
        : err.message,
  });
});

// Server startup
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🔒 Allowed origins:", allowedOrigins);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Handle shutdown gracefully
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});