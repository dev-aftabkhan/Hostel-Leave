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
  const students = await Student.find({ hostel_id: hostelId }).select("-_id -password_hash -fcm_tokens");
  if (!students || students.length === 0) throw new Error("No students found in this hostel");
 
  // now get requests of those students which are active
  const studentIds = students.map((student) => student.enrollment_no);
   
  // get requests with status and students info
  const activeRequests = await Request.find({ student_enrollment_number: { $in: studentIds }, request_status: status, active: true })
    .populate("student_action.action_by", "name enrollment_no")
    .populate("parent_action.action_by", "name")
    .sort({ created_at: -1 })
    .lean(); // use lean() to get plain JS objects

  // map student info to requests
  for (let request of activeRequests) {
    const studentInfo = students.find((student) => student.enrollment_no === request.student_enrollment_number);
    if (studentInfo) {
      request.student_info = studentInfo;
    }
  }
console.log(activeRequests);
  if (!activeRequests || activeRequests.length === 0) throw new Error("No active requests found for this hostel");
  return activeRequests;
};

// get warden by id
const getWardenById = async (wardenId) => {
  const warden = await Warden.findOne({ warden_id: wardenId }).select("-password_hash");
  if (!warden) throw new Error("Warden not found");
  return warden;
};

// get all requests by hostel id and month
const getAllRequestsByHostelIdAndMonth = async (hostelId, month) => {
  // Parse month as YYYY-MM
  const [year, monthIndex] = month.split('-').map(Number); // monthIndex: 1-12
  const startDate = new Date(Date.UTC(year, monthIndex - 1, 1, 0, 0, 0)); // start of month UTC
  const endDate = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0));       // start of next month UTC

  const students = await Student.find({ hostel_id: hostelId }).select("-_id -password_hash -fcm_tokens");
  if (!students || students.length === 0) throw new Error("No students found in this hostel");
 
  // now get requests of those students which are active
  const studentIds = students.map((student) => student.enrollment_no);

  const requests = await Request.find({
    student_enrollment_number: { $in: studentIds },
    created_at: { $gte: startDate, $lt: endDate }
  }).sort({ created_at: -1 })
    .lean();

  if (!requests || requests.length === 0) throw new Error("No requests found for this hostel and month");
  return requests;
};

module.exports = {
  loginWarden,
  getAllActiveRequestsByHostelId,
  getWardenById,
  getAllRequestsByHostelIdAndMonth
};

 
