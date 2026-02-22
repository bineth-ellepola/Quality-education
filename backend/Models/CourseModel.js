// models/Course.js

import mongoose from "mongoose";
import { nanoid } from "nanoid";

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
      type: Number,
      required: true
    },

    coverImage: {
      type: String,
      required: true,
      publicId: { type: String }
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
      default: "Free"
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
status: {
  type: String,
  enum: ["draft", "published", "unpublished"],
  default: "published"
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

const Course = mongoose.model("Course", courseSchema);

export default Course;
