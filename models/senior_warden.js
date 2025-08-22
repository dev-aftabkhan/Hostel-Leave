const mongoose = require('mongoose');
const { type } = require('os');


const SeniorWardenSchema = new mongoose.Schema({
  sen_warden_Id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hostel: { type: String, required: true, index: true },
  employee_id: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  phone: { type: String },
  email: { type: String, lowercase: true, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('SeniorWarden', SeniorWardenSchema);