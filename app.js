const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const adminRoutes = require("./routes/adminRoutes");
const wardenRoutes = require("./routes/wardenRoutes");
const studentRoutes = require("./routes/studentRoutes");
const requestRoutes = require("./routes/requestRoutes");
const parentRoutes = require("./routes/parentRoutes");
const securityGateRoutes = require("./routes/securityGateRoutes");


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
app.use("/api/request", requestRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/security", securityGateRoutes);

module.exports = app;
