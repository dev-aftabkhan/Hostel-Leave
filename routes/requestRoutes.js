const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const  requestController = require("../controller/requestControllers");

// 🔒 Secure route
router.put("/update-status", authMiddleware, requestController.updateRequestStatus);
router.get("/ByStatus/:status", authMiddleware, requestController.getRequestsByStatus);

module.exports = router;