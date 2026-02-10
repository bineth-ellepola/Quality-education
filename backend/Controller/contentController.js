const Content = require("../Model/Content");

// Create content
exports.createContent = async (req, res) => {
  try {
    const content = await Content.create(req.body);
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all contents
exports.getAllContents = async (req, res) => {
  const contents = await Content.find();
  res.json(contents);
};

// Get single content
exports.getContentById = async (req, res) => {
  const content = await Content.findById(req.params.id);
  res.json(content);
};

// Update content
exports.updateContent = async (req, res) => {
  const content = await Content.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(content);
};

// Delete content
exports.deleteContent = async (req, res) => {
  await Content.findByIdAndDelete(req.params.id);
  res.json({ message: "Content deleted" });
};
