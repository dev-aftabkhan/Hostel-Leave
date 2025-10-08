const express = require("express");
const router = express.Router();
const wardencontroller = require("../controller/wardenControllers");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login/warden", wardencontroller.wardenLogin);
router.get("/allRequest/:hostelId", authMiddleware, wardencontroller.getAllActiveRequestsByHostelId);
router.get("/profile", authMiddleware, wardencontroller.getWardenProfile)
router.get("/requests/:hostelId/:month", authMiddleware, wardencontroller.getAllRequestsByHostelIdAndMonth);
router.get("/statistics/:hostelId", authMiddleware, wardencontroller.getCountOfActiveRequestsByHostelId);
router.get("/allActiveRequests/:hostelId", authMiddleware, wardencontroller.getAllActiveRequests);

module.exports = router;
