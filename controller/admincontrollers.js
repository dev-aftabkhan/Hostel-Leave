const adminService = require("../services/adminService");
const { encryptData, decryptData } = require("../utils/cryptoUtils");

// ✅ Create Warden
exports.createWarden = async (req, res) => {
  try {
    // 🔓 decrypt incoming body
    const decryptedBody = decryptData(req.body.encrypted);
    const { wardenType, name, emp_id, hostel_id, phone_no, email } = decryptedBody;

    const { warden, plainPassword } = await adminService.createWarden(wardenType, {
      name,
      emp_id,
      hostel_id,
      phone_no,
      email,
    });

    // 🔐 encrypt response
    res.status(201).json(encryptData({
      message: `${wardenType} created successfully`,
      emp_id: warden.emp_id,
      generated_password: plainPassword
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};

// ✅ Create Admin
exports.createAdmin = async (req, res) => {
  try {
    // 🔓 decrypt incoming body
    const decryptedBody = decryptData(req.body.encrypted);
    const { name, email, emp_id, phone_no } = decryptedBody;

    const { admin, plainPassword } = await adminService.createAdmin({
      name,
      email,
      emp_id,
      phone_no,
    });

    // 🔐 encrypt response
    res.status(201).json(encryptData({
      message: "Admin created successfully",
      emp_id: admin.emp_id,
      generated_password: plainPassword
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};

// ✅ Create Hostel
exports.createHostel = async (req, res) => {
  try {
    // 🔓 decrypt incoming body
    const decryptedBody = decryptData(req.body.encrypted);
    const { hostel_name, check_out_start_time, latest_return_time, outing_allowed } = decryptedBody;

    const hostel = await adminService.createHostel({
      hostel_name,
      check_out_start_time,
      latest_return_time,
      outing_allowed,
    });

    // 🔐 encrypt response
    res.status(201).json(encryptData({
      message: "Hostel created successfully",
      hostel
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const decryptedBody = decryptData(req.body.encrypted);
    const { emp_id, password } = decryptedBody;

    const { token } = await adminService.loginAdmin(emp_id, password);

    res.status(200).json(encryptData({
      message: "Admin login successful",
      token
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};

exports.createStudent = async (req, res) => {
  try {
    const decryptedBody = decryptData(req.body.encrypted);

    const {
      enrollment_no,
      name,
      email,
      phone_no,
      hostel_id,
      room_no,
      semester,
      branch,
      parent1_name,
      parent1_phone,
      parent1_relation,
      parent2_name,
      parent2_phone,
      parent2_relation,
    } = decryptedBody;

    const studentData = {
      enrollment_no,
      name,
      email,
      phone_no,
      hostel_id,
      room_no,
      semester,
      branch
    };

    const parentsData = [];
    if (parent1_name && parent1_phone) {
      parentsData.push({
        name: parent1_name,
        phone_no: parent1_phone,
        relation: parent1_relation || "Parent"
      });
    }
    if (parent2_name && parent2_phone) {
      parentsData.push({
        name: parent2_name,
        phone_no: parent2_phone,
        relation: parent2_relation || "Parent"
      });
    }
    const created_by = req.user.id; // from auth middleware

    const { student, parents, password } = await adminService.createStudentWithParents(studentData, parentsData, created_by);

    res.status(201).json(encryptData({
      message: "Student and parents created successfully",
      student,
      parents,
      password
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};

// ✅ Create Branch
exports.createBranch = async (req, res) => {
  try {
    // 🔓 decrypt incoming body
    const decryptedBody = decryptData(req.body.encrypted);
    const { branch_name, max_semester } = decryptedBody;
    const created_by = req.user.id; // from auth middleware

    const branch = await adminService.createBranch({
      branch_name,
      max_semester,
      created_by
    });

    // 🔐 encrypt response
    res.status(201).json(encryptData({
      message: "Branch created successfully",
      branch
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};