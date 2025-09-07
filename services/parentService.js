const Parent = require("../models/parent");
const { generateToken } = require("../utils/jwtUtils");

// login parent through phone number and student enrollment number
const loginParent = async (phone_no, student_enrollment_no) => {
  const parent = await Parent.findOne({ phone_no, student_enrollment_no });
  if (!parent) throw new Error("Parent not found");

  // ✅ generate encrypted JWT
  const token = generateToken({ id: parent.parent_id, role: "parent", phone_no: parent.phone_no });

  return { token };
};

// get parent profile by id
const getParentById = async (parentId) => {
  const parent = await Parent.findOne({ parent_id: parentId }).select("-password_hash");
  if (!parent) throw new Error("Parent not found");
  return parent;
};


module.exports = {
  loginParent,
  getParentById,
};
