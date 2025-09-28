const Parent = require("../models/parent");
const Request = require("../models/request");
const Student = require("../models/student");
const { generateToken } = require("../utils/jwtUtils");

// login parent through phone number and student enrollment number
const loginParent = async (phone_no, student_enrollment_no) => {
  const parent = await Parent.findOne({ phone_no, student_enrollment_no });
  if (!parent) throw new Error("Parent not found");

  // ✅ generate encrypted JWT
  const token = generateToken({ id: parent.parent_id, role: "parent", phone_no: parent.phone_no, student_enrollment_no: student_enrollment_no });

  return { token };
};

// get parent profile by id
const getParentById = async (parentId) => {
  const parent = await Parent.findOne({ parent_id: parentId }).select("-password_hash");
  if (!parent) throw new Error("Parent not found");
  return parent;
};

// get all request for parent by student enrollment number
const getAllRequestsByStudentEnrollmentNo = async (studentEnrollmentNo) => {
  const requests = await Request.find({ student_enrollment_number: studentEnrollmentNo }).sort({ created_at: -1 })
    .populate("student_action.action_by", "name enrollment_no")
    .populate("parent_action.action_by", "name");
  return requests;
};

// get student by student_enrollment_no
const getStudentByEnrollmentNo = async (enrollmentNo) => {
  if(Array.isArray(enrollmentNo)) {
    const students = await Student.find({ enrollment_no: { $in: enrollmentNo } }).select("-password_hash");
    if (!students || students.length === 0) throw new Error("Students not found");
    return students;
  } else {
  const student = await Student.findOne({ enrollment_no: enrollmentNo }).select("-password_hash");
  if (!student) throw new Error("Student not found");
  return student;}
};

module.exports = {
  loginParent,
  getParentById,
  getAllRequestsByStudentEnrollmentNo,
  getStudentByEnrollmentNo
};
