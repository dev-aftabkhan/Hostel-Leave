const mongoose = require("mongoose");

const securityGuardSchema = new mongoose.Schema({
  security_guard_id: { type: String, unique: true },
  emp_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password_hash: { type: String, required: true },
  phone_no: { type: String, required: true },
  email: { type: String },
  created_by: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String },
  updated_at: { type: Date, default: Date.now },
  language_preference: { type: String, default: "en" }
});

module.exports = mongoose.model("SecurityGuard", securityGuardSchema);
