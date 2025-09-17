const SecurityGateService = require("../services/Security-gateService");
 

// Security Guard Login
exports.loginSecurityGuard = async (req, res) => {
  try {
    const decryptedBody = req.body;
     
    const { emp_id, password } = decryptedBody;

    const { token } = await SecurityGateService.loginSecurityGuard(emp_id, password);

    res.status(200).json({
      message: "Security Guard login successful",
      token,
    });
  } catch (err) {
    res.status(400).json( { error: err.message });
  }
};

// get all requests for security gate by status with security status  parameter
exports.getAllRequestsByStatus = async (req, res) => {
  try {
    const status = "accepted_by_warden";
    const { security_status } = req.params;  // <-- FIX

    const requests = await SecurityGateService.getActiveRequestsByStatus(status, security_status);
    res.status(200).json (requests);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
