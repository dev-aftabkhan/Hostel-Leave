const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const adminRoutes = require("./routes/adminRoutes");
const wardenRoutes = require("./routes/wardenRoutes");
const studentRoutes = require("./routes/studentRoutes");


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/warden", wardenRoutes);
app.use("/api/student", studentRoutes);

module.exports = app;
