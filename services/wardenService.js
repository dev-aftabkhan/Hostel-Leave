const Warden = require("../models/warden");
const Hostel = require("../models/hostel");
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

module.exports = {
  loginWarden,
};
