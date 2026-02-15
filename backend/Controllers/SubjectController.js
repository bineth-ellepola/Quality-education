// Controllers/SubjectController.js
import Subject from "../Models/SubjectModel.js";

// CREATE SUBJECT
export const createSubject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Name is required" });

    const subject = await Subject.create({ name, description });
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL SUBJECTS
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
