const express = require("express");
const router = express.Router();
const wardencontroller = require("../controller/wardenControllers");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login/warden", wardencontroller.wardenLogin);
router.get("/allRequest", authMiddleware, wardencontroller.getAllActiveRequestsByHostelId);

module.exports = router;
