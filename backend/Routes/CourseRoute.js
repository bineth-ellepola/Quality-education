const express = require("express");
const router = express.Router();
const courseController = require("../Controllers/CourseController.js");

// CREATE
router.post("/courses", courseController.createCourse);

// READ
router.get("/courses", courseController.getCourses);
router.get("/courses/:id", courseController.getSingleCourse);

// UPDATE
router.put("/courses/:id", courseController.updateCourse);

// PUBLISH / UNPUBLISH
router.patch("/courses/:id/toggle-publish", courseController.togglePublishCourse);

// DELETE (Soft)
router.delete("/courses/:id", courseController.deleteCourse);

module.exports = router;
