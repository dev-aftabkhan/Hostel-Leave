const mongoose = require("mongoose");

const WardenSchema = new mongoose.Schema({
  warden_id: { type: String, unique: true, required: true },
  emp_id: { type: String, required: true },
  name: { type: String, required: true },
  password_hash: { type: String, required: true },
  phone_no: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  created_by: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String },
  updated_at: { type: Date, default: Date.now },
  fcm_tokens: [{ type: String }],
  hostel_id: [{ type: String, required: true }],
  language_preferences: { type: String },
  profile_pic: { type: String },
  role: { type: String, enum: ["senior_warden", "warden"], required: true }
});

module.exports = mongoose.model("Warden", WardenSchema);
