const mongoose = require("mongoose");
const { act } = require("react");

const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  enrollment_no: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profile_pic: { type: String, default: "" },
  email: { type: String, required: true },
  phone_no: { type: String, required: true },
  password_hash: { type: String, required: true },
  hostel_id: { type: String, required: true },
  room_no: { type: Number },
  semester: { type: Number },
  branch: { type: String },
  active: { type: Boolean, default: true },
  fcm_tokens: [{ type: String }],
  created_by: { type: String },
  updated_by: { type: String }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

module.exports = mongoose.model("Student", studentSchema);
