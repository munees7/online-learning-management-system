const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Lesson = require("../models/Lesson");

// @desc  Get all courses (with search & filter)
// @route GET /api/courses
exports.getCourses = async (req, res) => {
  try {
    const { search, category, level, isFree, sort, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };

    if (search) query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
    if (category) query.category = category;
    if (level) query.level = level;
    if (isFree !== undefined) query.isFree = isFree === "true";

    const sortOptions = {
      newest: { createdAt: -1 },
      popular: { totalStudents: -1 },
      rating: { ratings: -1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate("instructor", "name avatar")
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, courses, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single course
// @route GET /api/courses/:id
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate("instructor", "name avatar bio");
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const lessons = await Lesson.find({ courseId: course._id }).sort("order");
    res.json({ success: true, course, lessons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Create course
// @route POST /api/courses
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({ ...req.body, instructor: req.user._id });
    res.status(201).json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update course
// @route PUT /api/courses/:id
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Only instructor owner or admin can update
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized" });

    course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, course });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete course
// @route DELETE /api/courses/:id
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorized" });

    await Course.findByIdAndDelete(req.params.id);
    await Lesson.deleteMany({ courseId: req.params.id });
    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get instructor's courses
// @route GET /api/courses/instructor/my
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get featured courses (for home page)
// @route GET /api/courses/featured
exports.getFeaturedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("instructor", "name avatar")
      .sort({ totalStudents: -1 })
      .limit(8);
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
