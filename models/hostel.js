const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema({
  hostel_id: { type: String, unique: true, required: true },
  hostel_name: { type: String, required: true },
  check_out_start_time: { type: String },
  latest_return_time: { type: String },
  outing_allowed: { type: Boolean, default: true },
  created_by: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_by: { type: String },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Hostel", hostelSchema);
