const Review = require("../models/Review");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// @desc  Add review
// @route POST /api/reviews
exports.addReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;

    // Must be enrolled to review
    const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (!enrollment) return res.status(403).json({ success: false, message: "Must be enrolled to review" });

    const existing = await Review.findOne({ userId: req.user._id, courseId });
    if (existing) return res.status(400).json({ success: false, message: "Already reviewed this course" });

    const review = await Review.create({ userId: req.user._id, courseId, rating, comment });

    // Update course average rating
    const reviews = await Review.find({ courseId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Course.findByIdAndUpdate(courseId, { ratings: avg.toFixed(1), totalRatings: reviews.length });

    await review.populate("userId", "name avatar");
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get reviews for a course
// @route GET /api/reviews/:courseId
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ courseId: req.params.courseId })
      .populate("userId", "name avatar")
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
