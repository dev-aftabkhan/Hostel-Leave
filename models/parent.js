const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  parent_id: { type: String, required: true, unique: true },
  student_enrollment_no: [{ type: String, required: true }], // can link multiple children
  name: { type: String, required: true },
  relation: { type: String, default: "Parent" },
  phone_no: { type: String, required: true },
  email: { type: String, default: "" },
  fcm_tokens: [{ type: String }],
  language_preference: { type: String, default: "en" },
  created_by: { type: String },
  updated_by: { type: String }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } });

module.exports = mongoose.model("Parent", parentSchema);
 