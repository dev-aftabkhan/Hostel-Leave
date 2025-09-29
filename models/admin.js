const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  admin_id: { type: String, unique: true, required: true },
  emp_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password_hash: { type: String},
  phone_no: { type: String, required: true },
  email: { type: String, required: true },
  active: { type: Boolean, default: true },
  created_by: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String },
  updated_at: { type: Date, default: Date.now },
  profile_pic: { type: String }
});

module.exports = mongoose.model("Admin", adminSchema);
