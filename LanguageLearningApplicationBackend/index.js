const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
require("./config/db");
const app = new express();
app.use(morgan('dev'));
app.use(cors());


const userRoutes = require("./routes/userRoutes");







app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`); });
