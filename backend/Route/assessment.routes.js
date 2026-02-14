const express = require("express");
const router = express.Router();

const {
  upload,
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
} = require("../Controller/assessment.controller");

router.post("/", upload.single("file"), createAssessment);
router.get("/", getAllAssessments);
router.get("/:id", getAssessmentById);
router.put("/:id", updateAssessment);
router.delete("/:id", deleteAssessment);

module.exports = router;
