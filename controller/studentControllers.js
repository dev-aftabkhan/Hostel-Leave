const studentService = require("../services/studentService");
const { encryptData, decryptData } = require("../utils/cryptoUtils");

// ✅ Student Login
exports.loginStudent = async (req, res) => {
  try {
    // 🔓 Decrypt body
    const decryptedBody = decryptData(req.body.encrypted);
    const { enrollment_no, password, fcm_token } = decryptedBody;

    const { token, student } = await studentService.loginStudent(enrollment_no, password, fcm_token);

    // 🔐 Encrypt response
    res.status(200).json(encryptData({
      message: "Login successful",
      enrollment_no: student.enrollment_no,
      name: student.name,
      profile_pic: student.profile_pic,
      token
    }));
  } catch (err) {
    res.status(401).json(encryptData({ error: err.message }));
  }
};

// ✅ Update Profile
exports.updateProfile = async (req, res) => {
  try {
    let updates = {};

    // 🔓 decrypt body if exists (for hostel_id, room_no, semester, branch)
    if (req.body.encrypted) {
      updates = decryptData(req.body.encrypted);
    }

    // ✅ If profile_pic uploaded
    if (req.file) {
      // Build full URL (assuming server runs on http://localhost:5000)
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      updates.profile_pic = imageUrl;
    }

    // Student ID will come from JWT auth
    const studentId = req.user.student_id;

    const updatedStudent = await studentService.updateStudentProfile(studentId, updates);

    res.status(200).json(encryptData({
      message: "Profile updated successfully",
      student: {
        enrollment_no: updatedStudent.enrollment_no,
        hostel_id: updatedStudent.hostel_id,
        profile_pic: updatedStudent.profile_pic,
        room_no: updatedStudent.room_no,
        semester: updatedStudent.semester,
        branch: updatedStudent.branch
      }
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};

// hostel-info
exports.getHostelInfo = async (req, res) => {
  try {
    const studentId = req.user.student_id;
    const hostelInfo = await studentService.getHostelInfoByStudent(studentId);

    res.status(200).json(encryptData({
      message: "Hostel information retrieved successfully",
      hostel: hostelInfo.hostel
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};

// all-hostel-info
exports.getAllHostelInfo = async (req, res) => {
  try {
    const hostels = await studentService.getAllHostelInfo();

    res.status(200).json(encryptData({
      message: "All hostel information retrieved successfully",
      hostels
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};

// all branches
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await studentService.getAllBranches();

    res.status(200).json(encryptData({
      message: "All branch information retrieved successfully",
      branches
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};

// get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const studentId = req.user.student_id;
    console.log("Authenticated Student ID:", studentId);
    const student = await studentService.getStudentById(studentId);

    res.status(200).json(encryptData({
      message: "Student information retrieved successfully",
      student
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};

// create request
exports.createRequest = async (req, res) => {
  try {
    const requestData = decryptData(req.body.encrypted);
    const student_enrollment_number = req.user.enrollment_no;
    const created_by = req.user.student_id;
    const newRequest = await studentService.createRequest({ ...requestData, student_enrollment_number, created_by });

    res.status(201).json(encryptData({
      message: "Request created successfully",
      request: newRequest
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};

// get all requests by student ID
exports.getAllRequestsByStudentId = async (req, res) => {
  try {
    const studentId = req.user.student_enrollment_number;
    const requests = await studentService.getAllRequestsByStudentId(studentId);

    res.status(200).json(encryptData({
      message: "All requests retrieved successfully",
      requests
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};

// get request by ID
exports.getRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;
    const request = await studentService.getRequestById(requestId);

    res.status(200).json(encryptData({
      message: "Request retrieved successfully",
      request
    }));
  } catch (err) {
    res.status(400).json(encryptData({ error: err.message }));
  }
};