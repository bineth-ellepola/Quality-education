const Course = require("../Models/CourseModel.js");
const Subject = require("../Models/SubjectModel.js");


 
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      instructor,
      duration,
      coverImage,
      level,
      price,
      currency,
      enrollmentLimit,
      prerequisites,
      tags
    } = req.body;

    // Basic validation
    if (!title || !description || !subject || !instructor || !duration || !coverImage) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing"
      });
    }

    // Check subject exists
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      return res.status(404).json({
        success: false,
        message: "Subject not found"
      });
    }

    const course = await Course.create({
      title,
      description,
      subject,
      instructor,
      duration,
      coverImage,
      level,
      price,
      currency,
      enrollmentLimit,
      prerequisites,
      tags
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


 
exports.getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", level, isPublished } = req.query;

    let query = { isDeleted: false };

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by level
    if (level) {
      query.level = level;
    }

    // Filter by publish state
    if (isPublished !== undefined) {
      query.isPublished = isPublished === "true";
    }

    const courses = await Course.find(query)
      .populate("subject", "name")
      .populate("instructor", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: courses
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



 
exports.getSingleCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({ _id: id, isDeleted: false })
      .populate("subject", "name")
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


 
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({ _id: id, isDeleted: false });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    Object.assign(course, req.body);

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


 
exports.togglePublishCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({ _id: id, isDeleted: false });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Prevent publishing if required fields missing
    if (!course.title || !course.description || !course.coverImage || !course.duration) {
      return res.status(400).json({
        success: false,
        message: "Complete course details before publishing"
      });
    }

    course.isPublished = !course.isPublished;
    await course.save();

    res.status(200).json({
      success: true,
      message: `Course ${course.isPublished ? "published" : "unpublished"} successfully`,
      data: course
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


 
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({ _id: id, isDeleted: false });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    course.isDeleted = true;
    await course.save();

    res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
