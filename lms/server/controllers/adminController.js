const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Review = require("../models/Review");

// @desc  Get dashboard analytics
// @route GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalCourses, totalEnrollments, totalReviews] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Review.countDocuments(),
    ]);

    const freeEnrollments = await Enrollment.countDocuments({ paymentStatus: "free" });
    const paidEnrollments = await Enrollment.countDocuments({ paymentStatus: "paid" });
    const students = await User.countDocuments({ role: "student" });
    const instructors = await User.countDocuments({ role: "instructor" });
    const freeCourses = await Course.countDocuments({ isFree: true });
    const paidCourses = await Course.countDocuments({ isFree: false });

    // Recent enrollments
    const recentEnrollments = await Enrollment.find()
      .populate("userId", "name email")
      .populate("courseId", "title price isFree")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      analytics: {
        totalUsers, totalCourses, totalEnrollments, totalReviews,
        freeEnrollments, paidEnrollments, students, instructors,
        freeCourses, paidCourses, recentEnrollments,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all users
// @route GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update user role
// @route PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete user
// @route DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get all courses (admin)
// @route GET /api/admin/courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email").sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
