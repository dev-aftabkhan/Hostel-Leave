const express = require("express");
const router = express.Router();
const admincontroller = require("../controller/admincontrollers");
const authMiddleware = require("../middleware/authMiddleware");

 

router.post("/create-warden", authMiddleware, admincontroller.createWarden);
router.put("/update-warden/:emp_id", authMiddleware, admincontroller.updateWardenByEmpId);
router.get("/all-wardens", authMiddleware, admincontroller.getAllWardens);
router.post("/create-admin", authMiddleware, admincontroller.createAdmin);
router.put("/update-admin/:emp_id", authMiddleware, admincontroller.updateAdminByEmpId);
router.get("/all-admins", authMiddleware, admincontroller.getAllAdmins);
router.post("/create-hostel", authMiddleware, admincontroller.createHostel);
router.put("/update-hostel/:hostel_id", authMiddleware, admincontroller.updateHostel);
router.put("/inactive-hostel/:hostel_id", authMiddleware, admincontroller.inactiveHostel);
router.get("/hostel/:hostel_id", authMiddleware, admincontroller.getHostelById);
router.post("/create-student", authMiddleware, admincontroller.createStudent);
router.put("/update-student/:student_enrollment_no", authMiddleware, admincontroller.updateStudent);
router.get("/student/:student_enrollment_no", authMiddleware, admincontroller.getStudentByEnrollmentNo);
router.get("/total-students", authMiddleware, admincontroller.getTotalStudents);
router.get("/outstudents", authMiddleware, admincontroller.getOutStudents);
router.get("/all-students", authMiddleware, admincontroller.getAllStudentsWithParents);
router.post("/login/admin", admincontroller.adminLogin);
router.post("/create-branch", authMiddleware, admincontroller.createBranch);
router.post("/update-branch/:branch_id", authMiddleware, admincontroller.updateBranch);
router.put("/reset-password", authMiddleware, admincontroller.resetPassword);
router.post("/create-security-guard", authMiddleware, admincontroller.createSecurityGuard);
router.put("/update-security-guard/:emp_id", authMiddleware, admincontroller.updateSecurityGuardByEmpId);
router.get("/all-security-guards", authMiddleware, admincontroller.getAllSecurityGuards);
router.get("/all-active-requests", authMiddleware, admincontroller.getAllActiveRequests);

module.exports = router;
