const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    totalMarks: {
      type: Number,
    },
    dueDate: {
      type: Date,
    },
    fileUrl: {
      type: String, // S3 file URL
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", assessmentSchema);
