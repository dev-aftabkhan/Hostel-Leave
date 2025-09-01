const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const  requestController = require("../controller/requestControllers");

// 🔒 Secure route
router.put("/update-status", authMiddleware, requestController.updateRequestStatus);

module.exports = router;