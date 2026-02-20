// models/SubjectModel.js

import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    code: {
      type: String,
      unique: true,
      sparse: true // allows null but enforces uniqueness if exists
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000
    },

    thumbnail: {
      type: String // Cloudinary URL
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all"],
      default: "all"
    },

    categoryType: {
      type: String,
      enum: ["academic", "professional", "skill-based"],
      default: "skill-based"
    },

    totalCourses: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active"
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    sortOrder: {
      type: Number,
      default: 0
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

// Indexes
subjectSchema.index({ name: "text", description: "text" });

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;