const SecurityGateService = require("../services/Security-gateService");
const { decryptData, encryptData } = require("../utils/cryptoUtils");

// Security Guard Login
exports.loginSecurityGuard = async (req, res) => {
  try {
    const decryptedBody = decryptData(req.body.encrypted);
     
    const { emp_id, password } = decryptedBody;

    const { token } = await SecurityGateService.loginSecurityGuard(emp_id, password);

    res.status(200).json(encryptData({
      message: "Security Guard login successful",
      token,
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};

// get all requests for security gate by status with security status  parameter
exports.getAllRequestsByStatus = async (req, res) => {
  try {
    const status = "accepted_by_warden";
    const { security_status } = req.params;  // <-- FIX

    const requests = await SecurityGateService.getActiveRequestsByStatus(status, security_status);
    res.status(200).json(encryptData(requests));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};
