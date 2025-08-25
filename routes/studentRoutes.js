const express = require("express");
const router = express.Router();
const { loginStudent } = require("../controller/studentControllers");

// Student Login API
router.post("/login", loginStudent);

module.exports = router;
