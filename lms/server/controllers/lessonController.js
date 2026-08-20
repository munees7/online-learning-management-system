const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// @desc  Create lesson
// @route POST /api/lessons
exports.createLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.body.courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized" });

    const lesson = await Lesson.create(req.body);
    res.status(201).json({ success: true, lesson });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get lessons for a course
// @route GET /api/lessons/:courseId
exports.getLessons = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const lessons = await Lesson.find({ courseId: req.params.courseId }).sort("order");

    // If user is not enrolled in paid course, only return preview lessons
    if (req.user) {
      const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId: req.params.courseId });
      if (!enrollment && !course.isFree) {
        const previewLessons = lessons.filter((l) => l.isPreview);
        return res.json({ success: true, lessons: previewLessons, locked: true });
      }
    }

    res.json({ success: true, lessons, locked: false });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update lesson
// @route PUT /api/lessons/:id
exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found" });
    res.json({ success: true, lesson });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete lesson
// @route DELETE /api/lessons/:id
exports.deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Lesson deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
