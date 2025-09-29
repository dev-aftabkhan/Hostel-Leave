const mongoose = require("mongoose");
const { act } = require("react");

const branchSchema = new mongoose.Schema({
    branch_id: { type: String, unique: true, required: true },
    branch_name: { type: String, required: true },
    max_semester: { type: Number, required: true },
    active: { type: Boolean, default: true },
    created_by: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_by: { type: String },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Branch", branchSchema);