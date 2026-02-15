import express from "express";
import * as SubjectController from "../Controllers/SubjectController.js";

const router = express.Router();

// Create subject
router.post("/", SubjectController.createSubject);

// Get all subjects
router.get("/", SubjectController.getSubjects);

export default router;
