const Security = require("../models/security");
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
module.exports = {
  loginSecurityGuard
};