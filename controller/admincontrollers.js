const { createWarden, createAdmin } = require("../services/adminService");
const { encryptData, decryptData } = require("../utils/cryptoUtils");
require("dotenv").config();

exports.createWarden = async (req, res) => {
  try {
    const { wardenType, name, employee_id, hostel, phone, email } = req.body;

    const { warden, plainPassword } = await createWarden(wardenType, {
      name,
      employee_id,
      hostel,
      phone,
      email
    });

    res.status(201).json({
      message: "Warden created successfully",
      employee_id: warden.employee_id,
      generated_password: plainPassword
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// create admin by admin only
exports.createAdmin = async (req, res) => {
  try {
    const decryptedBody = decryptData(req.body.encrypted);
    const { name, email, employee_id, phone, createdby } = decryptedBody;

    const { admin, plainPassword } = await createAdmin({
      name,
      email,
      employee_id,
      phone,
      createdby 
    });

    res.status(201).json(encryptData({
      message: "Admin created successfully",
      employee_id: admin.employee_id,
      generated_password: plainPassword
    }));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
