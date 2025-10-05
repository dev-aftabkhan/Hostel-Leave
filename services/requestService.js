const Student = require("../models/student");
const Parent = require("../models/parent");
const Warden = require("../models/warden");
const Request = require("../models/request");
const Security = require("../models/security");

exports.updateRequestStatus = async (requestId, userID, status, remark) => {
  const validStatuses = [
    "requested",
    "cancelled_by_student",
    "referred_to_parent",
    "cancelled_assistent_warden",
    "accepted_by_parent",
    "rejected_by_parent",
    "accepted_by_warden",
    "rejected_by_warden"
  ];

  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const request = await Request.findOne({ request_id: requestId });
  if (!request) throw new Error("Request not found");

  let userRole = null;
  let message = null;

  // 🔹 Student action
  const student = await Student.findOne({ student_id: userID });
  if (student) {
    userRole = "student";
    if (status === "cancelled_by_student") {
      request.student_action = { action_by: student };
      request.student_action = { action: status };
      request.student_action.createdAt = new Date();
      request.request_status = "cancelled_by_student";
      request.active = false;
    } else {
      message = "Student can only cancel their own request";
    }
  }

  // 🔹 Parent action
  else {
    const parent = await Parent.findOne({ parent_id: userID }).select("-password_hash -fcm_tokens");
     
    if (parent) {
      userRole = "parent";
      if (request.request_status === "referred_to_parent") {
        request.parent_action = { action_by: parent.toObject() };
        if (status === "accepted_by_parent" || status === "rejected_by_parent") {
          request.parent_action.action = status;
        }
        request.parent_action.createdAt = new Date();
        request.request_status =
          status === "accepted_by_parent" ? "accepted_by_parent" : "rejected_by_parent";
        if (remark) request.parent_remark = remark;
        if (request.request_status === "rejected_by_parent") {
          request.active = false;
        }
      } else {
        message = "Request is not referred to parent yet";
      }
    }

    // 🔹 Senior Warden action
    else {
      const seniorWarden = await Warden.findOne({ warden_id: userID, role: "senior_warden" }).select("-password_hash -fcm_tokens");
      if (seniorWarden) {
        userRole = "senior_warden";
        if (request.request_status === "accepted_by_parent") {
          request.senior_warden_action = { action_by: seniorWarden };
          //set action
          if (status === "accepted_by_warden" || status === "rejected_by_warden") {
            request.senior_warden_action.action = status;
          }
          request.senior_warden_action.createdAt = new Date();
          request.request_status =
            status === "accepted_by_warden" ? "accepted_by_warden" : "rejected_by_warden";
          if(request.request_status === "rejected_by_warden"){
            request.active = false;
          }
        } else {
          message = "Request is not accepted by parent yet";
        }
      }

      // 🔹 Assistant Warden action
      else {
        const assistantWarden = await Warden.findOne({ warden_id: userID, role: "warden" }).select("-password_hash -fcm_tokens");
        if (assistantWarden) {
          userRole = "assistant_warden";
          if (request.request_status === "requested") {
            request.assistent_warden_action = { action_by: assistantWarden };
            // If referring to parent, set the action
            if (status === "referred_to_parent" || status === "cancelled_assistent_warden") {
              request.assistent_warden_action.action = status;
            }
            request.assistent_warden_action.createdAt = new Date();
            request.request_status =
              status === "referred_to_parent" ? "referred_to_parent" : "cancelled_assistent_warden";
            if(request.request_status === "cancelled_assistent_warden"){
              request.active = false;
            }
          } else {
            message = "Request is not in requested state";
          }
        }

        // 🔹 security guard action
        else {
          const securityGuard = await Security.findOne({ security_guard_id: userID }).select("-password_hash -fcm_tokens");
          if (securityGuard) {
            userRole = "security_guard";
            if (request.request_status === "accepted_by_warden" && request.security_status === "pending") {
             
              //set action
              if (status === "out") {
                request.security_guard_action.action = status;
                request.security_guard_action = { action_by: securityGuard };
              
              request.security_guard_action.createdAt = new Date();
              request.security_status =
                status === "in" ? "in" : "out";}
            } else if(request.security_status === "out"  && request.request_status === "accepted_by_warden") {
               //set action
              if (status === "in") {
                request.security_guard_action.action = status;
                request.security_guard_action = { action_by: securityGuard };
              
              request.security_guard_action.createdAt = new Date();
              request.security_status =
                status === "in" ? "in" : "out";
              request.active = false;
              }
            }
          }
        }
      }
    }
  }

  request.last_updated_at = new Date();
  await request.save();

  return { request, message };
};

// get request by status latest first
exports.getRequestsByStatus = async (status) => {
  const requests = await Request.find({ request_status: status }).sort({ created_at: -1 });
  return requests;
};

// get all inactive requests by student enrollment number
exports.getAllInactiveRequestsByStudentEnrollmentNo = async (studentEnrollmentNo) => {
  const requests = await Request.find({ student_enrollment_number: studentEnrollmentNo, active: false }).sort({ created_at: -1 });
  return requests;
}

// get request by enrolement number and status
exports.getRequestsByEnrollmentNoAndStatus = async (studentEnrollmentNo, status) => {
  const requests = await Request.find({ student_enrollment_number: studentEnrollmentNo, request_status: status }).sort({ created_at: -1 });
  return requests;  
}

// get request by ID
exports.getRequestById = async (requestId) => {

  const requests = await Request.findOne({ request_id: requestId });
  const student = await Student.findOne({ enrollment_no: requests.student_enrollment_number });
  if (!requests) throw new Error("Request not found");

  // get senior_warden
  const seniorWarden = await Warden.findOne({ hostel_id: student.hostel_id, role: "senior_warden" }).select("-password_hash -fcm_tokens");
  if (!seniorWarden) throw new Error("Senior Warden not found");

  // get assistant_warden
  const assistantWarden = await Warden.findOne({ hostel_id: student.hostel_id, role: "warden" }).select("-password_hash -fcm_tokens");
  if (!assistantWarden) throw new Error("Assistant Warden not found");

  return {requests, seniorWarden, assistantWarden};
};

// get all requests by hostel id 
exports.getAllRequestsByHostelId = async (hostelId) => {
  const students = await Student.find({ hostel_id: hostelId }).select("enrollment_no -_id");
  const enrollmentNumbers = students.map(student => student.enrollment_no);
  const requests = await Request.find({ student_enrollment_number: { $in: enrollmentNumbers }, active: true }).sort({ created_at: -1 });
  return requests;
};