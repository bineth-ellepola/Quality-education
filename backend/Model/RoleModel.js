// models/Role.js
const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    required: true,
    unique: true,
    enum: ["admin", "student", "instructor"]
  }
}, { timestamps: true });

module.exports = mongoose.model("Role", roleSchema);
