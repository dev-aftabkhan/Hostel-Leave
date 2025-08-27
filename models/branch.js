const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
    branch_id: { type: String, unique: true, required: true },
    branch_name: { type: String, required: true },
    max_semester: { type: Number, required: true }
});

module.exports = mongoose.model("Branch", branchSchema);