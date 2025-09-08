const Warden = require("../models/warden");
const Hostel = require("../models/hostel");
const Student = require("../models/student");
const Request = require("../models/request");
const { generatePassword, hashPassword, comparePassword } = require("../utils/passwordUtils");
const { generateToken } = require("../utils/jwtUtils");

const loginWarden = async (emp_id, wardenType, password) => {
  const warden = await Warden.findOne({ emp_id, role: wardenType });
  if (!warden) throw new Error(`${wardenType} not found`);

  const isMatch = await comparePassword(password, warden.password_hash);
  if (!isMatch) throw new Error("Invalid credentials");

  // ✅ generate encrypted JWT
  const token = generateToken({ id: warden.warden_id, role: warden.role, emp_id: warden.emp_id });

  return { token };
};

// get all active requests for warden by hostel id
const getAllActiveRequestsByHostelId = async (hostelId, status) => {

  // find students in that hostel
  const students = await Student.find({ hostel_id: hostelId });
  if (!students || students.length === 0) throw new Error("No students found in this hostel");
 
  // now get requests of those students which are active
  const studentIds = students.map((student) => student.enrollment_no);
   
  const activeRequests = await Request.find({
    student_enrollment_number: { $in: studentIds },
    active: true,
    request_status: { $in: status }
  }).sort({ created_at: -1 });
   if (!activeRequests || activeRequests.length === 0) throw new Error("No active requests found for this hostel");
  return activeRequests;
};

// get warden by id
const getWardenById = async (wardenId) => {
  const warden = await Warden.findOne({ warden_id: wardenId }).select("-password_hash");
  if (!warden) throw new Error("Warden not found");
  return warden;
};

module.exports = {
  loginWarden,
  getAllActiveRequestsByHostelId,
  getWardenById
};

 
