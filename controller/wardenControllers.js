const wardenService = require("../services/wardenService");
const Warden = require("../models/warden.js");
 


// ✅ Warden Login
exports.wardenLogin = async (req, res) => {
  try {
    const decryptedBody = req.body;
    const { emp_id, wardenType, password } = decryptedBody;

    const { token } = await wardenService.loginWarden(emp_id, wardenType, password);

    res.status(200).json({
      message: `${wardenType} login successful`,
      token
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    
    // get hostel if from params
    const { hostelId } = req.params;
    
    // check if the hostel is from the wardens hostels list
    if (!user.hostel_id.includes(hostelId)) {
      throw new Error("You are not authorized to view requests for this hostel");
    }

    const requests = await wardenService.getAllActiveRequestsByHostelId(hostelId, status);

    res.status(200).json({
      message: "Active requests fetched successfully",
      requests
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get warden profile
exports.getWardenProfile = async (req, res) => {
  try {
    const wardenId = req.user.id;
    const profile = await wardenService.getWardenById(wardenId);

     res.status(200).json({
      message: "profile fetched successfully",
      profile
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all requests by hostel id and month
exports.getAllRequestsByHostelIdAndMonth = async (req, res) => {
  try {
    const user = await Warden.findOne({ warden_id: req.user.id });
    const { hostelId, month } = req.params;

    // check if the hostel is from the wardens hostels list
    if (!user.hostel_id.includes(hostelId)) {
      throw new Error("You are not authorized to view requests for this hostel");
    }

    const requests = await wardenService.getAllRequestsByHostelIdAndMonth(hostelId, month);

    res.status(200).json({
      message: "Requests fetched successfully",
      requests
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};