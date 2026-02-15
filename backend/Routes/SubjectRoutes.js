const express = require("express");
const router = express.Router();
const SubjectController = require("../Controllers/SubjectController.js");

// Create subject
router.post("/", SubjectController.createSubject);

// Get all subjects
router.get("/", SubjectController.getSubjects);

module.exports = router;
