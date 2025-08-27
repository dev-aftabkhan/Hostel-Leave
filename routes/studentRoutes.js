const express = require("express");
const router = express.Router();
const studentControllers = require("../controller/studentControllers");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddlewares");

// Student Login API
router.post("/login", studentControllers.loginStudent);

// Student Update Profile API
router.put("/profile", authMiddleware, upload.single("profile_pic"), studentControllers.updateProfile);

module.exports = router;
