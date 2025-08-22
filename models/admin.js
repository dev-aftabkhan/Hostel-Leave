const mongoose = require('mongoose');
const { type } = require('os');
const { ref } = require('process');

const adminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employee_id: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdby: { type: String, required: true, ref: 'User' }
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
