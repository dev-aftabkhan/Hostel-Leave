const Warden = require("../models/warden");
const Admin = require("../models/admin");
const Hostel = require("../models/hostel");
const Student = require("../models/student");
const Parent  = require("../models/parent");
const Branch = require("../models/branch");
const SecurityGuard = require("../models/security");
const { v4: uuidv4 } = require("uuid");
const { generatePassword, hashPassword, comparePassword } = require("../utils/passwordUtils");
const { generateToken } = require("../utils/jwtUtils");

// ✅ Create Warden (senior or assistant -> handled by role)
const createWarden = async (wardenType, data) => {
  const { name, emp_id, hostel_id, phone_no, email, created_by } = data;

  const existingWarden = await Warden.findOne({ emp_id });
  if (existingWarden) throw new Error("Warden with this emp_id already exists");

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
    created_by,
    role: wardenType
  });

  await newWarden.save();
  return { warden: newWarden, plainPassword };
};

// ✅ Create Admin
const createAdmin = async (data) => {
  const { name, email, emp_id, phone_no, created_by } = data;

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
    created_by,
  });

  await newAdmin.save();
  return { admin: newAdmin, plainPassword };
};

// ✅ Create Hostel
const createHostel = async (data) => {
  const {hostel_name, check_out_start_time, latest_return_time, outing_allowed, created_by } = data;

  const existingHostel = await Hostel.findOne({ hostel_name });
  if (existingHostel) throw new Error("Hostel with this name already exists");

  const newHostel = new Hostel({
    hostel_id: "HOSTEL-" + hostel_name.replace(/\s+/g, "-").toUpperCase(),
    hostel_name,
    check_out_start_time,
    latest_return_time,
    outing_allowed,
    created_by,
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

async function createStudentWithParents(studentData, parentsData, created_by) {

  const existingStudent = await Student.findOne({ enrollment_no: studentData.enrollment_no });
  if (existingStudent) throw new Error("Student with this enrollment number already exists");

  const student_id = "STU_" + uuidv4().slice(0, 8);
  const plainPassword = generatePassword(10);
  const password_hash = await hashPassword(plainPassword);


  const student = new Student({
    ...studentData,
    student_id,
    password_hash,
    created_by,
  });
  await student.save();

  const savedParents = [];
  for (let parent of parentsData) {
    let parentDoc = await Parent.findOne({ phone_no: parent.phone_no });

    if (parentDoc) {
      // already exists → just add new student enrollment if not present
      if (!parentDoc.student_enrollment_no.includes(student.enrollment_no)) {
        parentDoc.student_enrollment_no.push(student.enrollment_no);
      }
      parentDoc.updated_by = created_by;
      parentDoc.relation = parent.relation; // update relation if needed
      await parentDoc.save();
    } else {
      // create new parent
      const parent_id = "PAR_" + uuidv4().slice(0, 8);
      parentDoc = new Parent({
        parent_id,
        student_enrollment_no: [student.enrollment_no],
        name: parent.name,
        phone_no: parent.phone_no,
        relation: parent.relation,
        created_by,
      });
      await parentDoc.save();
    }
    savedParents.push(parentDoc);
  }

  return { student, parents: savedParents, password: plainPassword };
};

// create branch
const createBranch = async (data) => {
  const { branch_name, max_semester, created_by } = data;

  const existingBranch = await Branch.findOne({ branch_name });
  if (existingBranch) throw new Error("Branch with this name already exists");

  const newBranch = new Branch({
    branch_id: "BRANCH-" + branch_name.replace(/\s+/g, "-").toUpperCase(),
    branch_name,
    max_semester,
    created_by
  });

  await newBranch.save();
  return newBranch;
};

// reset password by id for all by checking previous password
const resetPasswordById = async (user_id, oldPassword, newPassword) => {
  const admin = await Admin.findOne({ admin_id: user_id });

   if (admin) {
     const isMatch = await comparePassword(oldPassword, admin.password_hash);
     if (!isMatch) throw new Error("Old password is incorrect");

     admin.password_hash = await hashPassword(newPassword);
     await admin.save();
   } else {
      // for warden
      const warden = await Warden.findOne({ warden_id: user_id });
      if (warden) {
        const isMatch = await comparePassword(oldPassword, warden.password_hash);
        if (!isMatch) throw new Error("Old password is incorrect");

        warden.password_hash = await hashPassword(newPassword);
        await warden.save();
      } else {
        // for student
        const student = await Student.findOne({ student_id: user_id });
        if (student) {
          const isMatch = await comparePassword(oldPassword, student.password_hash);
          if (!isMatch) throw new Error("Old password is incorrect");

          student.password_hash = await hashPassword(newPassword);
          await student.save();
        }
      }
    }


  return { message: "Password reset successfully" };
};

// create security guard
const createSecurityGuard = async (data) => {
  const { name, phone_no, email, emp_id, created_by } = data;

  const existingGuard = await SecurityGuard.findOne({ emp_id });
  if (existingGuard) throw new Error("Security guard with this employee ID already exists");

  // generate password
  const plainPassword = generatePassword(10);
  const password_hash = await hashPassword(plainPassword);

  const security_guard_id = "SEC_" + uuidv4().slice(0, 8);
  const newGuard = new SecurityGuard({
    security_guard_id,
    name,
    phone_no,
    email,
    emp_id,
    password_hash,
    created_by
  });

  await newGuard.save();
  return {newGuard, plainPassword};
};

module.exports = { createWarden, createAdmin, createHostel, loginAdmin, createStudentWithParents, createBranch, resetPasswordById, createSecurityGuard };
