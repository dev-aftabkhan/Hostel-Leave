const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  request_id: { type: String, default: mongoose.Types.ObjectId },
  request_type: { type: String, enum: ["leave", "outing"], required: true },
  student_enrollment_number: { type: String, required: true },
  applied_at: { type: Date, default: Date.now },
  applied_from: { type: Date, required: true },
  applied_to: { type: Date, required: true },
  reason: { type: String, required: true },
  request_status: {
    type: String,
    enum: [
      "requested",
      "cancelled_by_student",
      "referred_to_parent",
      "cancelled_assistent_warden",
      "accepted_by_parent",
      "rejected_by_parent",
      "accepted_by_warden",
      "rejected_by_warden"
    ],
    default: "requested"
  },
  active: { type: Boolean, default: true },
  last_updated_at: { type: Date, default: Date.now },

  parent_action: {
    action_by: { type: JSON, ref: "Parent" },
    action: { type: String, enum: ["accepted_by_parent", "rejected_by_parent"] },
    createdAt: { type: Date }
  },
  assistent_warden_action: {
    action_by: { type: JSON, ref: "assistent_Warden" },
    action: { type: String, enum: ["cancelled_assistent_warden", "referred_to_parent"] },
    createdAt: { type: Date }
  },
  senior_warden_action: {
    action_by: { type: JSON, ref: "Senior_Warden" },
    action: { type: String, enum: ["accepted_by_warden", "rejected_by_warden"] },
    createdAt: { type: Date }
  },
  security_guard_action: {
    action_by: { type: JSON, ref: "Security_Guard" },
    action: { type: String, enum: ["in", "out"] },
    createdAt: { type: Date }
  },
  student_action: {
    action_by: { type: JSON, ref: "Student" },
    action: { type: String, enum: ["cancelled_by_student"] },
    createdAt: { type: Date }
  },
  parent_remark: { type: String },
  created_by: { type: String, ref: "user" },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

module.exports = mongoose.model("Request", requestSchema);
