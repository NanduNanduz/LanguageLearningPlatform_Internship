import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js"; // Ensure this is also using ES6 import
import authRoutes from "./routes/authRoutes.js"; // Updated to ES6 import

dotenv.config();
const app = express();
app.use(morgan('dev'));
app.use(cors());
db();

app.use('/auth', authRoutes); // Ensure the route prefix is correct

app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`); });
