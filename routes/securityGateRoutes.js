const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const securityGateController = require("../controller/security-gateControllers");

router.post("/login", securityGateController.loginSecurityGuard);
router.get("/allRequests", authMiddleware, securityGateController.getAllRequestsByStatus);

module.exports = router;