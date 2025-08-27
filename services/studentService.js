const Student = require("../models/student");
const Hostel = require("../models/hostel");
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
    student_id: student.student_id,
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
