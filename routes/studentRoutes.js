const express = require("express");
const router = express.Router();
const studentControllers = require("../controller/studentControllers");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddlewares");

// Student Login API
router.post("/login", studentControllers.loginStudent);

// Student Update Profile API
router.put("/profile", authMiddleware, upload.single("profile_pic"), studentControllers.updateProfile);
// hostel-info
router.get("/hostel-info", authMiddleware, studentControllers.getHostelInfo);

// all-hostel-info
router.get("/all-hostel-info", authMiddleware, studentControllers.getAllHostelInfo);

// all-branches
router.get("/all-branches", authMiddleware, studentControllers.getAllBranches);
// get student by ID
router.get("/student-profile", authMiddleware, studentControllers.getStudentById);

// create request
router.post("/create-request", authMiddleware, studentControllers.createRequest);

// get all requests by student ID
router.get("/requests", authMiddleware, studentControllers.getAllRequestsByStudentId);

// get request by ID
router.get("/requests/:id", authMiddleware, studentControllers.getRequestById);

// get all inactive requests by student ID
router.get("/inactive-requests", authMiddleware, studentControllers.getAllInactiveRequestsByStudentEnrollmentNo);

module.exports = router;
