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

// Helper to ensure public Supabase URL
const formatPublicUrl = (url) => {
  if (!url) return null;
  // If it's already a public URL, return as is
  if (url.includes('/storage/v1/object/public/')) return url;

  // If it's an S3 endpoint URL, transform it
  if (url.includes('storage.supabase.co/storage/v1/s3')) {
    try {
      const parts = url.split('/');
      const fileName = parts.pop();
      const bucketName = process.env.AWS_BUCKET_NAME;
      const projectRef = process.env.AWS_ENDPOINT.split('.')[0].split('//')[1];
      return `https://${projectRef}.supabase.co/storage/v1/object/public/${bucketName}/${fileName}`;
    } catch (e) {
      return url;
    }
  }
  return url;
};

// CREATE
const createAssessment = async (req, res) => {
  try {
    const newAssessment = await Assessment.create({
      title: req.body.title,
      description: req.body.description,
      totalMarks: req.body.totalMarks,
      dueDate: req.body.dueDate,
      fileUrl: req.file ? req.file.location : null,
      fileName: req.file ? req.file.originalname : null,
    });

    // Return with formatted URL for frontend
    const assessmentObj = newAssessment.toObject();
    assessmentObj.fileUrl = formatPublicUrl(assessmentObj.fileUrl);

    res.status(201).json(assessmentObj);
  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find().sort({ createdAt: -1 });
    const formatted = assessments.map(a => {
      const obj = a.toObject();
      obj.fileUrl = formatPublicUrl(obj.fileUrl);
      return obj;
    });
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ONE
const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: "Not found" });

    const obj = assessment.toObject();
    obj.fileUrl = formatPublicUrl(obj.fileUrl);
    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
const updateAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: "Not found" });

    const updateFields = {
      title: req.body.title || assessment.title,
      description: req.body.description !== undefined ? req.body.description : assessment.description,
      totalMarks: req.body.totalMarks || assessment.totalMarks,
      dueDate: req.body.dueDate || assessment.dueDate,
    };

    if (req.file) {
      updateFields.fileUrl = req.file.location;
      updateFields.fileName = req.file.originalname;
    }

    const updated = await Assessment.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    const obj = updated.toObject();
    obj.fileUrl = formatPublicUrl(obj.fileUrl);
    res.json(obj);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// VIEW ATTACHMENT
const viewAttachment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment || !assessment.fileUrl) {
      return res.status(404).send("File not found");
    }

    const publicUrl = formatPublicUrl(assessment.fileUrl);
    res.redirect(publicUrl);
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
  viewAttachment,
  deleteAssessment,
};
