const wardenService = require("../services/wardenService");
const Warden = require("../models/warden.js");
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

// ✅ Get all active requests for warden by hostel id
exports.getAllActiveRequestsByHostelId = async (req, res) => {
  try {

    const user = await Warden.findOne({ warden_id: req.user.id });
     
    let status = null;
    if(user.role === "warden")
    {
      status = "requested";
    }else if(user.role === "senior_warden")
    {
      status = "accepted_by_parent";
    }

    const requests = await wardenService.getAllActiveRequestsByHostelId(user.hostel_id, status);

    res.status(200).json(encryptData({
      message: "Active requests fetched successfully",
      requests
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};