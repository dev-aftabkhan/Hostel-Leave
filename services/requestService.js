const Student = require("../models/student");
const Parent = require("../models/parent");
const Warden = require("../models/warden");
const Request = require("../models/request");

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
      request.request_status = "cancelled_by_student";
      request.active = false;
    } else {
      message = "Student can only cancel their own request";
    }
  }

  // 🔹 Parent action
  else {
    const parent = await Parent.findOne({ parent_id: userID });
    if (parent) {
      userRole = "parent";
      if (request.request_status === "referred_to_parent") {
        request.parent_action = { action_by: userID };
        if (status === "accepted_by_parent" || status === "rejected_by_parent") {
          request.parent_action.action = status;
        }
        request.request_status =
          status === "accepted_by_parent" ? "accepted_by_parent" : "rejected_by_parent";
        if (remark) request.parent_remark = remark;
      } else {
        message = "Request is not referred to parent yet";
      }
    }

    // 🔹 Senior Warden action
    else {
      const seniorWarden = await Warden.findOne({ warden_id: userID, role: "senior_warden" });
      if (seniorWarden) {
        userRole = "senior_warden";
        if (request.request_status === "accepted_by_parent") {
          request.senior_warden_action = { action_by: userID };
          //set action
          if (status === "accepted_by_warden" || status === "rejected_by_warden") {
            request.senior_warden_action.action = status;
          }
          request.request_status =
            status === "accepted_by_warden" ? "accepted_by_warden" : "rejected_by_warden";
        } else {
          message = "Request is not accepted by parent yet";
        }
      }

      // 🔹 Assistant Warden action
      else {
        const assistantWarden = await Warden.findOne({ warden_id: userID, role: "warden" });
        if (assistantWarden) {
          userRole = "assistant_warden";
          if (request.request_status === "requested") {
            request.assistent_warden_action = { action_by: userID };
            // If referring to parent, set the action
            if (status === "referred_to_parent" || status === "cancelled_assistent_warden") {
              request.assistent_warden_action.action = status;
            }
            request.request_status =
              status === "referred_to_parent" ? "referred_to_parent" : "cancelled_assistent_warden";
          } else {
            message = "Request is not in requested state";
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