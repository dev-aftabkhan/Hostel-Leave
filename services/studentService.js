const Student = require("../models/student");
const Parent = require("../models/parent");
const Hostel = require("../models/hostel");
const Branch = require("../models/branch");
const request = require("../models/request"); 
const Warden = require("../models/warden");
const mongoose = require("mongoose"); 
const {comparePassword} = require("../utils/passwordUtils");
const { generateToken } = require("../utils/jwtUtils");

exports.loginStudent = async (enrollment_no, password, fcm_token) => {
  const student = await Student.findOne({ enrollment_no });
  if (!student) throw new Error("Invalid enrollment number or password");

  const isMatch = await comparePassword(password, student.password_hash);
  if (!isMatch) throw new Error("Invalid enrollment number or password");
  
   // ✅ update FCM token in DB
    if (fcm_token) {
      student.fcm_tokens = fcm_token;
      await student.save();  // <-- this actually saves it
    }

  // ✅ Generate JWT token
  const token = generateToken({
    id: student.student_id,
    enrollment_no: student.enrollment_no,
    role: "student"
  });
  // save fcm token
  await student.updateOne({ fcm_token });

  return { token, student };
};

exports.updateStudentProfile = async (studentId, updates) => {
  const allowedFields = ["hostel_id", "profile_pic", "room_no", "semester", "branch"];
  const filteredUpdates = {};

  // ✅ Pick only allowed fields
  for (let key of allowedFields) {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  }

  // 🔑 Use student_id instead of _id
  const student = await Student.findOneAndUpdate(
    { student_id: studentId },        // match by student_id
    { $set: filteredUpdates },
    { new: true }
  );

  if (!student) throw new Error("Student not found");
  return student;
};

// export hostel-info by student
exports.getHostelInfoByStudent = async (studentId) => {
  const student = await Student.findOne({ student_id: studentId });
  if (!student) throw new Error("Student not found");

  const hostel = await Hostel.findOne({ hostel_id: student.hostel_id });
  if (!hostel) throw new Error("Hostel not found");

  return {
    hostel: {
      hostel_id: hostel.hostel_id,
      name: hostel.hostel_name,
      check_out_start_time: hostel.check_out_start_time,
      latest_return_time: hostel.latest_return_time,
      outing_allowed: hostel.outing_allowed,
    },
  };
};

// get all hostel information
exports.getAllHostelInfo = async () => {
  const hostels = await Hostel.find();
  return hostels.map(hostel => ({
    hostel_id: hostel.hostel_id,
    name: hostel.hostel_name,
    check_out_start_time: hostel.check_out_start_time,
    latest_return_time: hostel.latest_return_time,
    outing_allowed: hostel.outing_allowed,
  }));
};

// get all branches
exports.getAllBranches = async () => {
  const branches = await Branch.find();
  return branches.map(branch => ({
    branch_id: branch.branch_id,
    name: branch.branch_name,
    max_semester: branch.max_semester
  }));
};

// get student by ID
exports.getStudentById = async (studentId) => {
  const student = await Student.findOne({ student_id: studentId });
  // parents-info
  const parentsInfo = await Parent.find({ student_enrollment_no: student.enrollment_no });
  if (!student) throw new Error("Student not found");
  return { student, parentsInfo };
};

// create request with proper validation
exports.createRequest = async (requestData) => {
  const { request_type, student_enrollment_number, applied_from, applied_to, reason, created_by } = requestData;

  // Validate required fields
  if (!request_type || !student_enrollment_number || !applied_from || !applied_to || !reason || !created_by) {
    throw new Error("All fields are required");
  }
  // request_id is generated automatically
  requestData.request_id =  new mongoose.Types.ObjectId().toString();
  // Create and save the request
  const newRequest = new request(requestData);
  await newRequest.save();
  return newRequest;
};

// get all requests by id
exports.getAllRequestsByStudentId = async (studentId) => {
  console.log("Fetching requests for student ID:", studentId);
  const student = studentId.student;
  // get by latest first
  const requests = await request.find({ student_id: student.student_enrollment_number }).sort({ created_at: -1 });
  if (!requests) throw new Error("No requests found for this student");
  // get senior_warden
  const seniorWarden = await Warden.findOne({ hostel_id: student.hostel_id, role: "senior_warden" });
  if (!seniorWarden) throw new Error("Senior Warden not found");

  // get assistant_warden
  const assistantWarden = await Warden.findOne({ hostel_id: student.hostel_id, role: "warden" });
  if (!assistantWarden) throw new Error("Assistant Warden not found");

  return { requests, seniorWarden, assistantWarden };
};

// get request by ID
exports.getRequestById = async (requestId) => {
  const requests = await request.findOne({ request_id: requestId });
  if (!requests) throw new Error("Request not found");
  return requests;
};
