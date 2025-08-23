const Warden = require("../models/warden");
const Admin = require("../models/admin");
const Hostel = require("../models/hostel");
const { generatePassword, hashPassword, comparePassword } = require("../utils/passwordUtils");
const { generateToken } = require("../utils/jwtUtils");

// ✅ Create Warden (senior or assistant -> handled by role)
const createWarden = async (wardenType, data) => {
  const { name, emp_id, hostel_id, phone_no, email } = data;

  if (!["senior_warden", "warden"].includes(wardenType)) {
    throw new Error("Invalid warden type (must be senior_warden or warden)");
  }

  // only one senior per hostel
  if (wardenType === "senior_warden" || wardenType === "warden") {
    const existingWarden = await Warden.findOne({ hostel_id, role: wardenType });
    if (existingWarden) throw new Error(`Hostel ${hostel_id} already has a ${wardenType}`);
  }

  const plainPassword = generatePassword(10);
  const password_hash = await hashPassword(plainPassword);

  const newWarden = new Warden({
    warden_id: wardenType.toUpperCase() + "-" + emp_id,
    emp_id,
    hostel_id,
    name,
    password_hash,
    phone_no,
    email,
    created_by: "super_admin",
    role: wardenType
  });

  await newWarden.save();
  return { warden: newWarden, plainPassword };
};

// ✅ Create Admin
const createAdmin = async (data) => {
  const { name, email, emp_id, phone_no } = data;

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) throw new Error("Admin with this email already exists");

  const plainPassword = generatePassword(10);
  const password_hash = await hashPassword(plainPassword);

  const newAdmin = new Admin({
    admin_id: "ADMIN-" + emp_id,
    emp_id,
    name,
    password_hash,
    phone_no,
    email,
    created_by: "super_admin",
  });

  await newAdmin.save();
  return { admin: newAdmin, plainPassword };
};

// ✅ Create Hostel
const createHostel = async (data) => {
  const {hostel_name, check_out_start_time, latest_return_time, outing_allowed } = data;

  const existingHostel = await Hostel.findOne({ hostel_name });
  if (existingHostel) throw new Error("Hostel with this name already exists");

  const newHostel = new Hostel({
    hostel_id: "HOSTEL-" + hostel_name.replace(/\s+/g, "-").toUpperCase(),
    hostel_name,
    check_out_start_time,
    latest_return_time,
    outing_allowed,
  });

  await newHostel.save();
  return newHostel;
};

// login admin
const loginAdmin = async (emp_id, password) => {
  const admin = await Admin.findOne({ emp_id });
  if (!admin) throw new Error("Admin not found");

  const isMatch = await comparePassword(password, admin.password_hash);
  if (!isMatch) throw new Error("Invalid credentials");

  // ✅ generate encrypted JWT
  const token = generateToken({ id: admin.admin_id, role: "admin", emp_id: admin.emp_id });

  return { token };
};


module.exports = { createWarden, createAdmin, createHostel, loginAdmin };
