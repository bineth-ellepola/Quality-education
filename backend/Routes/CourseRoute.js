import express from "express";
import upload from '../middlewares/upload.js'
import * as courseController from "../Controllers/CourseController.js";

const router = express.Router();

// CREATE
router.post("/courses",  upload.single("coverImage"),courseController.createCourse);

// READ
router.get("/courses", courseController.getCourses);
router.get("/courses/:id",upload.single("coverImage"), courseController.getSingleCourse);

// UPDATE
router.put("/courses/:id", upload.single("coverImage"),courseController.updateCourse);

// PUBLISH / UNPUBLISH
router.patch("/courses/:id/toggle-publish", courseController.togglePublishCourse);

// DELETE (Soft)
router.delete("/courses/:id", courseController.deleteCourse);

export default router;
