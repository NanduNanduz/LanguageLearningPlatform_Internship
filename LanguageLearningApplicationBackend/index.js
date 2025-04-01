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

// Initialize dotenv and express
dotenv.config();

const app = express();

// Define allowed origins
const allowedOrigins = [
  "http://localhost:5173", // Local development
  "https://language-learning-platform-internship-yiok.vercel.app", // Frontend
  "https://language-learning-platform-internship.vercel.app", // Backend
];

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const msg = `CORS error: ${origin} not allowed`;
    console.log(msg);
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-Request-Id"],
};

// Middleware
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Enable preflight for all routes

// Debug middleware
app.use((req, res, next) => {
  console.log("Incoming Origin:", req.headers.origin);
  console.log("Request Method:", req.method);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
db();

// Create HTTP server and setup Socket.io
const server = createServer(app);
const io = setupSocket(server);

// Attach io to the request object
app.use((req, res, next) => {
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