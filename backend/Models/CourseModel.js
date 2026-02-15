// models/Course.js

const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const courseSchema = new mongoose.Schema(
  {
    // Custom readable course ID (ex: CRS-8F3K9L)
    courseId: {
      type: String,
      unique: true,
      default: () => `CRS-${nanoid(6).toUpperCase()}`
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    duration: {
      type: Number, // in hours
      required: true
    },

    coverImage: {
      type: String, // Cloudinary or image URL
      required: true
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },

    price: {
      type: Number,
      default: 0
    },

    currency: {
      type: String,
      default: "USD"
    },

    enrollmentLimit: {
      type: Number,
      default: 100
    },

    enrolledStudentsCount: {
      type: Number,
      default: 0
    },

    prerequisites: [
      {
        type: String
      }
    ],

    tags: [
      {
        type: String
      }
    ],

    isPublished: {
      type: Boolean,
      default: false
    },

    averageRating: {
      type: Number,
      default: 0
    },

    totalRatings: {
      type: Number,
      default: 0
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
