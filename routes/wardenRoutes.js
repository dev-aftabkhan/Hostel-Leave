const express = require("express");
const router = express.Router();
const wardencontroller = require("../controller/wardenControllers");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/login/warden", wardencontroller.wardenLogin);

module.exports = router;
