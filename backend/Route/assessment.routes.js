const express = require("express");
const router = express.Router();

const {
  upload,
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  viewAttachment,
  deleteAssessment,
} = require("../Controller/assessment.controller");

router.post("/", upload.single("file"), createAssessment);
router.get("/", getAllAssessments);
router.get("/view/:id", viewAttachment);
router.get("/:id", getAssessmentById);
router.put("/:id", upload.single("file"), updateAssessment);
router.delete("/:id", deleteAssessment);

```javascript
router.get("/details/:id", getAssessmentById);
```


module.exports = router;
