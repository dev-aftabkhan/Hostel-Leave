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
