const Assessment = require("../Model/Assessment");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../Config/s3");

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

// GENERATE PRE-SIGNED URL
const getPresignedUrl = async (req, res) => {
  try {
    const { fileName, fileType } = req.query;
    if (!fileName) return res.status(400).json({ message: "fileName is required" });

    const key = `assessments/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      ContentType: fileType || "application/octet-stream",
      ACL: "public-read",
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    // The public URL where the file will be accessible after upload
    const projectRef = process.env.AWS_ENDPOINT.split('.')[0].split('//')[1];
    const publicUrl = `https://${projectRef}.supabase.co/storage/v1/object/public/${process.env.AWS_BUCKET_NAME}/${key}`;

    res.json({ uploadUrl: signedUrl, publicUrl });
  } catch (error) {
    console.error("Presigned URL Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// CREATE
const createAssessment = async (req, res) => {
  try {
    const newAssessment = await Assessment.create({
      title: req.body.title,
      description: req.body.description,
      totalMarks: req.body.totalMarks,
      dueDate: req.body.dueDate,
      fileUrl: req.body.fileUrl || null,
      fileName: req.body.fileName || null,
    });

    res.status(201).json(newAssessment);
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

    if (req.body.fileUrl) {
      updateFields.fileUrl = req.body.fileUrl;
      updateFields.fileName = req.body.fileName;
    }

    const updated = await Assessment.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    res.json(updated);
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
  getPresignedUrl,
  createAssessment,
  getAllAssessments,
  getAssessmentById,
  updateAssessment,
  viewAttachment,
  deleteAssessment,
};
//80% commit
