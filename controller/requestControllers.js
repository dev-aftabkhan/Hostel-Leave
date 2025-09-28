const  requestService = require("../services/requestService");
const studentService = require("../services/studentService");
const Parent = require("../models/parent");

exports.updateRequestStatus = async (req, res) => {
  try {
    // 🔓 decrypt incoming request
    const decryptedBody = req.body;
    const { requestId, status, remark } = decryptedBody;

    // 👤 User comes from JWT authMiddleware
    const userID = req.user.id;

    const { request: updatedRequest, message } = await requestService.updateRequestStatus(
      requestId,
      userID,
      status,
      remark
    );

    res.status(200).json({
       
        message: message || "Request status updated successfully",
        request_status: updatedRequest.request_status
       
    });
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// request by status
exports.getRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const requests = await requestService.getRequestsByStatus(status);

    res.status(200).json({
      encrypted:  requests
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get all inactive requests by student enrollment number
exports.getAllInactiveRequestsByStudentEnrollmentNo = async (req, res) => {
  try {
    let enrollmentNo;

    if (req.user.role === "student") {
      const student = await studentService.getStudentById(req.user.id);
      if (!student) throw new Error("Student not found");
      enrollmentNo = student.student.enrollment_no;
    } 
    
    else if (req.user.role === "parent") {
      const parent = await Parent.findOne({ parent_id: req.user.id });
      if (!parent) throw new Error("Parent not found");
      enrollmentNo = parent.student_enrollment_no;
    }

    const requests = await requestService.getAllInactiveRequestsByStudentEnrollmentNo(enrollmentNo);

    res.status(200).json({
      message: "All inactive requests retrieved successfully",
      requests
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get request by student enrollment number and status
exports.getRequestsByStudentEnrollmentNoAndStatus = async (req, res) => {
  try {
    let { status } = req.params;
    let enrollmentNo;

    if (req.user.role === "student") {
      const student = await studentService.getStudentById(req.user.id);
      if (!student) throw new Error("Student not found");
      enrollmentNo = student.student.enrollment_no;
    } else if (req.user.role === "parent") {
      const parent = await Parent.findOne({ parent_id: req.user.id });
      if (!parent) throw new Error("Parent not found");
      enrollmentNo = parent.student_enrollment_no;
    }
    if (status === "All") {
       status = ["requested", "accepted_by_warden", "rejected_by_warden", "referred_to_parent", "accepted_by_parent", "rejected_by_parent", "cancelled_by_student", "cancelled_assistent_warden"];
    } else if(status === "Cancelled"){
      status = "cancelled_by_student";
    } else if(status === "Approved"){
      status = "accepted_by_warden";
    } else if(status === "Rejected"){
      status = ["rejected_by_warden", "rejected_by_parent", "cancelled_assistent_warden"];
    } else {
      throw new Error("Invalid status parameter");
    }
    const requests = await requestService.getRequestsByEnrollmentNoAndStatus(enrollmentNo, status);

    res.status(200).json({
      message: "Requests retrieved successfully",
      requests
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get request by ID
exports.getRequestById = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { requests, seniorWarden, assistantWarden } = await requestService.getRequestById(requestId);

    res.status(200).json({
      message: "Request retrieved successfully",
      request: requests,  // Assuming you want the first request
      seniorWarden,
      assistantWarden
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

 