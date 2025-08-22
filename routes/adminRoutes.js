const express = require("express");
const router = express.Router();
const admincontroller = require("../controller/admincontrollers");

router.post("/create-warden", admincontroller.createWarden);

module.exports = router;
