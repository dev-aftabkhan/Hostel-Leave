 const Student = require("../models/student");
const {comparePassword} = require("../utils/passwordUtils");
const { generateToken } = require("../utils/jwtUtils");

exports.loginStudent = async (enrollment_no, password) => {
  const student = await Student.findOne({ enrollment_no });
  if (!student) throw new Error("Invalid enrollment number or password");

  const isMatch = await comparePassword(password, student.password_hash);
  if (!isMatch) throw new Error("Invalid enrollment number or password");

  // ✅ Generate JWT token
  const token = generateToken({
    student_id: student.student_id,
    enrollment_no: student.enrollment_no,
    role: "student"
  });

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