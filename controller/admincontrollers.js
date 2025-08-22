const { createWarden } = require("../services/adminService");

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

    
