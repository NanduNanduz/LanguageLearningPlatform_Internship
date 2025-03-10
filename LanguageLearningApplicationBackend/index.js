import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js"; // Ensure this is also using ES6 import
import authRoutes from "./routes/authRoutes.js"; // Updated to ES6 import
import instructorRoutes from "./routes/instructorRoutes.js"
import studentAndInstructorRoutes from "./routes/studentAndInstructorRoutes.js"
import adminRoutes from "./routes/adminRoutes.js";



dotenv.config();
const app = express();
app.use(morgan('dev'));
app.use(cors());
db(); // calling db

app.use('/auth', authRoutes); // Ensure the route prefix is correct
app.use('/instructor',instructorRoutes); // all function of instructor
app.use('/user',studentAndInstructorRoutes)
app.use("/admin", adminRoutes);

app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`); });
