const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["video", "lab_sheet", "lecture_note", "assignment", "quiz", "other"],
    default: "video"
  },
  course: {
    type: String,
    required: true
  },
  module: {
    type: String,
    required: true
  },
  week: {
    type: String
  },
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner"
  },
  url: {
    type: String,
    // required: true // Made optional because we can have fileUrl instead
  },
  fileUrl: {
    type: String
  },
  eventDate: {
    type: Date
  },
  description: {
    type: String
  },
  tags: {
    type: [String]
  },
  visibility: {
    type: String,
    enum: ["published", "draft"],
    default: "published"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Content", contentSchema);

