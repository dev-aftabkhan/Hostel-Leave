const adminService = require("../services/adminService");
const Student = require("../models/student");
const Hostel = require("../models/hostel");
const EmailService = require("../utils/sendemail");

// Create Warden
exports.createWarden = async (req, res) => {
  try {
    const { wardenType, name, emp_id, hostel_id, phone_no, email } = req.body;
    const created_by = req.user.admin_id; // from auth middleware
    const { warden, plainPassword } = await adminService.createWarden(wardenType, {
      name,
      emp_id,
      hostel_id,
      phone_no,
      email,
      created_by
    });

    if (warden) {
       // send email to student with their credentials
      const emailSubject = "Hostel Leave Account Credentials";
      const emailBody = `
        <p>Dear <b>${warden.name}</b>,</p>
        <p>Your warden account has been created successfully. Here are your login credentials:</p>
        <ul>
          <li><b>Employee ID:</b> ${warden.emp_id}</li>
          <li><b>Password:</b> ${plainPassword}</li>
        </ul>
        <p>Please change your password after your first login.</p>
        <p>Regards,<br/>Hostel Management Team</p>
      `;
      // send email
      await EmailService.sendEmail(warden.email, emailSubject, emailBody);

    }

     
    res.status(201).json({
      message: `${wardenType} created successfully`,
      emp_id: warden.emp_id,
      generated_password: plainPassword
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//update warden by emp_id
exports.updateWardenByEmpId = async (req, res) => {
  try {
    const { emp_id } = req.params;
    const updatedData = req.body;
    const warden = await adminService.updateWardenByEmpId(emp_id, updatedData);
    res.status(200).json({
      message: "Warden updated successfully",
      warden
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get all wardens with their hostels and roles
exports.getAllWardens = async (req, res) => {
  try {
    const wardens = await adminService.getAllWardens();
    res.status(200).json({
      message: "Wardens retrieved successfully",
      wardens
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create Admin
exports.createAdmin = async (req, res) => {
  try {
     
    const decryptedBody = req.body;
    const { name, email, emp_id, phone_no } = decryptedBody;
    const created_by = req.user.admin_id; // from auth middleware
    const { admin, plainPassword } = await adminService.createAdmin({
      name,
      email,
      emp_id,
      phone_no,
      created_by
    });

    if (admin) {
       // send email to student with their credentials
      const emailSubject = "Hostel Leave Account Credentials";
      const emailBody = `
        <p>Dear <b>${admin.name}</b>,</p>
        <p>Your Admin account has been created successfully. Here are your login credentials:</p>
        <ul>
          <li><b>Employee ID:</b> ${admin.emp_id}</li>
          <li><b>Password:</b> ${plainPassword}</li>
        </ul>
        <p>Please change your password after your first login.</p>
        <p>Regards,<br/>Hostel Management Team</p>
      `;
      // send email
      await EmailService.sendEmail(admin.email, emailSubject, emailBody);

    }

     
    res.status(201).json({
      message: "Admin created successfully",
      emp_id: admin.emp_id,
      generated_password: plainPassword
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Admin
exports.updateAdminByEmpId = async (req, res) => {
  try {
    const { emp_id } = req.params;
    const updatedData = req.body;
    const admin = await adminService.updateAdminByEmpId(emp_id, updatedData);
    res.status(200).json({
      message: "Admin updated successfully",
      admin
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();
    res.status(200).json({
      message: "Admins retrieved successfully",
      admins
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create Hostel
exports.createHostel = async (req, res) => {
  try {
     const decryptedBody = req.body;
    const { hostel_name, check_out_start_time, latest_return_time, outing_allowed, room_occupancy, total_rooms } = decryptedBody;
    const created_by = req.user.id; // from auth middleware
    const hostel = await adminService.createHostel({
      hostel_name,
      check_out_start_time,
      latest_return_time,
      outing_allowed,
      room_occupancy,
      total_rooms,
      created_by
    });

     res.status(201).json({
      message: "Hostel created successfully",
      hostel
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Hostel
exports.updateHostel = async (req, res) => {
  try {
    const { hostel_id } = req.params;
    const updatedData = req.body;
    const hostel = await adminService.updateHostel(hostel_id, updatedData);

    res.status(200).json({
      message: "Hostel updated successfully",
      hostel
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// inactive Hostel
exports.inactiveHostel = async (req, res) => {
  try {
    const { hostel_id } = req.params;
    const hostel = await adminService.inactiveHostel(hostel_id);

    res.status(200).json({
      message: "Hostel deactivated successfully",
      hostel
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get hostel by id
exports.getHostelById = async (req, res) => {
  try {
    const { hostel_id } = req.params;
    const hostel = await adminService.getHostelById(hostel_id);

    res.status(200).json({
      message: "Hostel retrieved successfully",
      hostel
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const decryptedBody = req.body;
    const { emp_id, password } = decryptedBody;

    const { token } = await adminService.loginAdmin(emp_id, password);

    res.status(200).json({
      message: "Admin login successful",
      token
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const decryptedBody = req.body;

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

    //check if the allocated room is available for that hostel as it should not exceed the room_occupancy of the hostel
    const hostel = await adminService.getHostelById(hostel_id);
    if (!hostel) {
      return res.status(404).json({ error: "Hostel not found" });
    }

    // check if the room_no is valid for that hostel
    if (room_no < 1 || room_no > hostel.total_rooms) {
      return res.status(400).json({ error: `Invalid room number for ${hostel.hostel_name}. It should be between 1 and ${hostel.total_rooms} or it should be under the total_rooms limit` });
    }

    // Check if the room has reached max occupancy
    const existingStudents = await Student.countDocuments({
      hostel_id,
      room_no
    });

    if (existingStudents >= hostel.room_occupancy) {
      return res.status(400).json({ error: `Room ${room_no} in ${hostel.hostel_name} is already full` });
    }

    const { student, parents, password } = await adminService.createStudentWithParents(studentData, parentsData, created_by);

    // check if student creation was successful
    if (student) {
       // send email to student with their credentials
      const emailSubject = "Hostel Leave Account Credentials";
      const emailBody = `
        <p>Dear <b>${student.name}</b>,</p>
        <p>Your student account has been created successfully. Here are your login credentials:</p>
        <ul>
          <li><b>Enrollment Number:</b> ${student.enrollment_no}</li>
          <li><b>Password:</b> ${password}</li>
        </ul>
        <p>Please change your password after your first login.</p>
        <p>Regards,<br/>Hostel Management Team</p>
      `;
      // send email
      await EmailService.sendEmail(student.email, emailSubject, emailBody);

    }

    res.status(201).json({
      message: "Student and parents created successfully",
      student,
      parents,
      password
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// update student and parents
exports.updateStudent = async (req, res) => {
  try {
    const { student_enrollment_no } = req.params;
    const decryptedBody = req.body; // assuming body is decrypted here
    const { student: studentData, parents: parentsData } = decryptedBody;
    const updated_by = req.user.id; // from auth middleware

    const { student, parents } = await adminService.updateStudentAndParents(student_enrollment_no, studentData, parentsData, updated_by);

    res.status(200).json({
      message: "Student and parents updated successfully",
      student,
      parents
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get list of student by enrollment number
exports.getStudentByEnrollmentNo = async (req, res) => {
  try {
    const { student_enrollment_no } = req.params;
    const student = await adminService.getStudentByEnrollmentNo(student_enrollment_no);
    res.status(200).json({
      message: "Student retrieved successfully",
      student
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get all students with parents
exports.getAllStudentsWithParents = async (req, res) => {
  try {
    const studentsWithParents = await adminService.getAllStudentsWithParents();
    res.status(200).json({
      message: "All students retrieved successfully",
      data: studentsWithParents
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create Branch
exports.createBranch = async (req, res) => {
  try {
     const decryptedBody = req.body;
    const { branch_name, max_semester } = decryptedBody;
    const created_by = req.user.id; // from auth middleware

    const branch = await adminService.createBranch({
      branch_name,
      max_semester,
      created_by
    });

     res.status(201).json({
      message: "Branch created successfully",
      branch
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Branch (soft delete)
exports.updateBranch = async (req, res) => {
  try {
    const { branch_id } = req.params;
    const branch = await adminService.updateBranch(branch_id, req.body);

    res.status(200).json({
      message: "Branch updated successfully",
      branch
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    const decryptedBody = req.body;
    const { oldPassword, newPassword } = decryptedBody;
    const user_id = req.user.id; // from auth middleware

    const result = await adminService.resetPasswordById(user_id, oldPassword, newPassword);

    res.status(200).json({
      message: result.message
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create Security Guard
exports.createSecurityGuard = async (req, res) => {
  try {
    const decryptedBody = req.body;
    const { name, phone_no, email, emp_id } = decryptedBody;
    const created_by = req.user.id; // from auth middleware

    const {newGuard, plainPassword} = await adminService.createSecurityGuard({
      name,
      phone_no,
      email,
      emp_id,
      created_by
    });

    if (newGuard) {
       // send email to student with their credentials
      const emailSubject = "Hostel Leave Account Credentials";
      const emailBody = `
        <p>Dear <b>${newGuard.name}</b>,</p>
        <p>Your security Gate account has been created successfully. Here are your login credentials:</p>
        <ul>
          <li><b>Employee ID:</b> ${newGuard.emp_id}</li>
          <li><b>Password:</b> ${plainPassword}</li>
        </ul>
        <p>Please change your password after your first login.</p>
        <p>Regards,<br/>Hostel Management Team</p>
      `;
      // send email
      await EmailService.sendEmail(newGuard.email, emailSubject, emailBody);

    }

     

     res.status(201).json({
      message: "Security guard created successfully",
      securityGuard: newGuard,
      password: plainPassword
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Security Guard
exports.updateSecurityGuardByEmpId = async (req, res) => {
  try {
    const { emp_id } = req.params;
    const decryptedBody = req.body;
    const updated_by = req.user.id; // from auth middleware

    const guard = await adminService.updateSecurityGuardByEmpId(emp_id, {
      ...decryptedBody,
      updated_by
    });

    res.status(200).json({
      message: "Security guard updated successfully",
      securityGuard: guard
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get all security guards
exports.getAllSecurityGuards = async (req, res) => {
  try {
    const guards = await adminService.getAllSecurityGuards();
    res.status(200).json({
      message: "All security guards retrieved successfully",
      data: guards
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get total no. of students with their info
exports.getTotalStudents = async (req, res) => {
  try {
    const { totalStudents, studentInfo } = await adminService.getTotalStudents();
    res.status(200).json({
      message: "Total students retrieved successfully",
      totalStudents,
      studentInfo
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get student which are out for outing or leave
exports.getOutStudents = async (req, res) => {
  try {
    const outStudents = await adminService.getOutStudents();
    res.status(200).json({
      message: "Out students retrieved successfully",
      data: outStudents
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get all active requests 
exports.getAllActiveRequests = async (req, res) => {
  try {
    const activeRequests = await adminService.getAllActiveRequests();
    res.status(200).json({
      message: "Active requests retrieved successfully",
      data: activeRequests
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// reset password for admin, warden, student, and security guard
exports.resetPasswordbyadmin = async (req, res) => {
  try {
    const { user_id } = req.body;

    const { user, newPassword } = await adminService.resetPasswordByAdminOrWarden(user_id);
     
    if (user) {
      // send email notification
      const emailSubject = "Hostel Leave Account Credentials is Reset";
      const emailBody = `
        <p>Dear <b>${user.name}</b>,</p>
        <p>Your account password has been reset successfully. Here are your login credentials:</p>
        <ul>
          <li><b>Password:</b> ${newPassword}</li>
        </ul>
        <p>Please change your password after your login.</p>
        <p>Regards,<br/>Hostel Management Team</p>
      `;
      await EmailService.sendEmail(user.email, emailSubject, emailBody);
    }

    res.status(200).json({
     user
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};