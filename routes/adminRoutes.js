const express = require("express");
const router = express.Router();
const admincontroller = require("../controller/admincontrollers");
const authMiddleware = require("../middleware/authMiddleware");

 

router.post("/create-warden", authMiddleware, admincontroller.createWarden);
router.post("/create-admin", authMiddleware, admincontroller.createAdmin);
router.post("/create-hostel", authMiddleware, admincontroller.createHostel);
router.put("/update-hostel/:hostel_id", authMiddleware, admincontroller.updateHostel);
router.put("/inactive-hostel/:hostel_id", authMiddleware, admincontroller.inactiveHostel);
router.post("/create-student", authMiddleware, admincontroller.createStudent);
router.post("/login/admin", admincontroller.adminLogin);
router.post("/create-branch", authMiddleware, admincontroller.createBranch);
router.put("/reset-password", authMiddleware, admincontroller.resetPassword);
router.post("/create-security-guard", authMiddleware, admincontroller.createSecurityGuard);

module.exports = router;
