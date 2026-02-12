const Assessment = require("../Model/Assessment");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3");

// S3 Upload Middleware
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});

// CREATE
const createAssessment = async (req, res) => {
  try {
    const newAssessment = await Assessment.create({
      title: req.body.title,
      description: req.body.description,
      totalMarks: req.body.totalMarks,
      dueDate: req.body.dueDate,
      fileUrl: req.file ? req.file.location : null,
    });

    res.status(201).json(newAssessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateAssessment = async (req, res) => {
  try {
    const updated = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
const deleteAssessment = async (req, res) => {
  try {
    await Assessment.findByIdAndDelete(req.params.id);
    res.json({ message: "Assessment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  upload,
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
};
