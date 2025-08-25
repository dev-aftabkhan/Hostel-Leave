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

 