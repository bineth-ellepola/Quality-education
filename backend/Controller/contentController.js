const Content = require("../Model/Content");



// ==============================
// CREATE Content
// ==============================
exports.createContent = async (req, res) => {
  try {
    const data = { ...req.body };
    // Support legacy field names
    if (data.subject && !data.course) data.course = data.subject;
    if (data.contentType && !data.type) data.type = data.contentType;
    if (data.resourceLink && !data.url) data.url = data.resourceLink;

    const { title, type, course, module, week, difficulty, url, description, visibility, eventDate } = data;

    // Handle tags (support both 'tags' and 'tags[]' keys from FormData)
    let tags = data.tags || data['tags[]'] || [];
    if (typeof tags === 'string') tags = tags.split(',').map(t => t.trim());

    let fileUrl = "";
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    // Validation: Require either URL or File
    if (!title || !course || !module || (!url && !fileUrl)) {
      return res.status(400).json({ message: "Title, Course, Module, and either URL or File are required" });
    }

    let validEventDate = undefined;
    if (eventDate && eventDate.trim() !== "") {
      const d = new Date(eventDate);
      if (!isNaN(d.getTime())) {
        validEventDate = d;
      }
    }

    const newContent = new Content({
      title,
      type,
      course,
      module,
      week,
      difficulty,
      url,
      fileUrl,
      eventDate: validEventDate,
      description,
      tags,
      visibility
    });

    const savedContent = await newContent.save();
    console.log("✅ Content Saved:", savedContent._id);

    res.status(201).json({
      message: "Content created successfully",
      data: savedContent
    });

  } catch (error) {
    console.error("❌ Error creating content:", error.message);
    res.status(500).json({
      message: "Error creating content",
      error: error.message
    });
  }
};

// ===============
// GET All Contents
// ===============
exports.getAllContents = async (req, res) => {
  try {
    console.log("Fetching all contents...");
    const rawContents = await Content.find().sort({ createdAt: -1 });

    // Normalize legacy fields for the frontend
    const contents = rawContents.map(doc => {
      const item = doc.toObject();
      return {
        ...item,
        course: item.course || item.subject || "Unknown Course",
        module: item.module || "General",
        type: item.type || item.contentType || "other",
        url: item.url || item.resourceLink || ""
      };
    });

    res.status(200).json({
      count: contents.length,
      data: contents
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching contents",
      error: error.message
    });
  }
};

// =================
// GET Content By ID
// ==============================
exports.getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.status(200).json(content);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching content",
      error: error.message
    });
  }
};

// ==============================
// UPDATE Content
// ==============================
exports.updateContent = async (req, res) => {
  try {
    const data = { ...req.body, updatedAt: Date.now() };
    // Support legacy field names
    if (data.subject && !data.course) data.course = data.subject;
    if (data.contentType && !data.type) data.type = data.contentType;
    if (data.resourceLink && !data.url) data.url = data.resourceLink;

    const updateData = data;

    // Handle tags (support both 'tags' and 'tags[]' keys)
    if (data.tags || data['tags[]']) {
      let tags = data.tags || data['tags[]'];
      if (typeof tags === 'string') tags = tags.split(',').map(t => t.trim());
      updateData.tags = tags;
    }

    if (req.file) {
      updateData.fileUrl = `/uploads/${req.file.filename}`;
    }

    if (req.body.eventDate && req.body.eventDate.trim() !== "") {
      const d = new Date(req.body.eventDate);
      if (!isNaN(d.getTime())) {
        updateData.eventDate = d;
      } else {
        delete updateData.eventDate;
      }
    } else if (req.body.eventDate === "") {
      updateData.eventDate = null;
    }

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,          // return updated document
        runValidators: true // apply schema validation
      }
    );

    if (!updatedContent) {
      return res.status(404).json({ message: "Content not found" });
    }

    console.log("✅ Content Updated:", updatedContent._id);

    res.status(200).json({
      message: "Content updated successfully",
      data: updatedContent
    });

  } catch (error) {
    console.error("❌ Error updating content:", error.message);
    res.status(500).json({
      message: "Error updating content",
      error: error.message
    });
  }
};

// ==============================
// DELETE Content
// ==============================
exports.deleteContent = async (req, res) => {
  try {
    const deletedContent = await Content.findByIdAndDelete(req.params.id);

    if (!deletedContent) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.status(200).json({
      message: "Content deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting content",
      error: error.message
    });
  }
};
