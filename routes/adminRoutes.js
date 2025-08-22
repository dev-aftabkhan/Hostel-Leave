const express = require("express");
const router = express.Router();
const admincontroller = require("../controller/admincontrollers");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/create-warden", admincontroller.createWarden);
router.post("/create-admin", admincontroller.createAdmin);

module.exports = router;
