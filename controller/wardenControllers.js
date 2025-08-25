const wardenService = require("../services/wardenService");
const { encryptData, decryptData } = require("../utils/cryptoUtils");


// ✅ Warden Login
exports.wardenLogin = async (req, res) => {
  try {
    const decryptedBody = decryptData(req.body.encrypted);
    const { emp_id, wardenType, password } = decryptedBody;

    const { token } = await wardenService.loginWarden(emp_id, wardenType, password);

    res.status(200).json(encryptData({
      message: `${wardenType} login successful`,
      token
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};
