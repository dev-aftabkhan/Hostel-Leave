const Security = require("../models/security");
const Request = require("../models/request");
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

//get all active requests for security guard  by status and  security status

const getActiveRequestsByStatus = async (status, security_status) => {
  const requests = await Request.find({ request_status: status, security_status }).sort({ created_at: -1 });
    return requests;
};

module.exports = {
  loginSecurityGuard,
  getActiveRequestsByStatus
};