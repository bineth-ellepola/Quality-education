const express = require("express");
const router = express.Router();

const {
  getPresignedUrl,
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  viewAttachment,
  deleteAssessment,
} = require("../Controller/assessment.controller");

router.get("/presigned-url", getPresignedUrl);
router.post("/", createAssessment);
router.get("/", getAllAssessments);
router.get("/view/:id", viewAttachment);
router.get("/:id", getAssessmentById);
router.put("/:id", updateAssessment);
router.delete("/:id", deleteAssessment);

router.get("/details/:id", getAssessmentById);

module.exports = router;
