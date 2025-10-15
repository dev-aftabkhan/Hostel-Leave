const Security = require("../models/security");
const Request = require("../models/request");
const Student = require("../models/student")
const adminservice = require("../services/adminService");
const Hostel = require("../models/hostel");
const { generateToken } = require("../utils/jwtUtils");
const { comparePassword } = require("../utils/passwordUtils");

// login security guard through emp_id and password
const loginSecurityGuard = async (emp_id, password) => {
     
  const securityGuard = await Security.findOne({ emp_id });
  if (!securityGuard) throw new Error("Security Guard not found");
    
  const isMatch = await comparePassword(password, securityGuard.password_hash);
  if (!isMatch) throw new Error("Invalid password");
   

  // Generate JWT token
  const token = generateToken({
    id: securityGuard.security_guard_id,
    emp_id: securityGuard.emp_id,
    role: "security"
  });
 
  return { token };
};

//get all active requests for security guard  by status and  security status

const getActiveRequestsByStatus = async (status, security_status) => {
  const requests = await Request.find({ request_status: status, security_status }).sort({ created_at: -1 }).lean();
  if (!requests.length) return [];

  const enrollmentNos = requests.map(r => r.student_enrollment_number);
  const students = await Student.find({ enrollment_no: { $in: enrollmentNos } })
    .select("-_id -password_hash -fcm_tokens")
    .lean();   
  if (!students || students.length === 0) throw new Error("No students found in this request");
  
  // map student info
   for (const request of requests) {
    const studentInfo = students.find(
      (student) => student.enrollment_no === request.student_enrollment_number
    );

    if (studentInfo) {
      const hostel = await adminservice.getHostelById(studentInfo.hostel_id);
      studentInfo.hostel_name = hostel?.hostel_name || "Unknown Hostel";
      request.student_info = studentInfo;
    }
  }
    return requests;
};

module.exports = {
  loginSecurityGuard,
  getActiveRequestsByStatus
};