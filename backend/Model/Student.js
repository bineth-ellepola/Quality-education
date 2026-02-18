const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  registrationNumber: {
    type: String,
    required: true,
    unique: true
  },

  faculty: String,
  academicYear: String,

  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }]
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
