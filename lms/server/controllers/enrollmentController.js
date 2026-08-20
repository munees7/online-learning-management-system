const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// @desc  Enroll in a course (free) or create payment intent (paid)
// @route POST /api/enroll
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Check if already enrolled
    const existing = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (existing) return res.status(400).json({ success: false, message: "Already enrolled" });

    // FREE course → direct enrollment
    if (course.isFree || course.price === 0) {
      const enrollment = await Enrollment.create({
        userId: req.user._id,
        courseId,
        paymentStatus: "free",
      });
      await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });
      return res.status(201).json({ success: true, enrollment, message: "Enrolled successfully!" });
    }

    // PAID course → create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price * 100), // convert to paise/cents
      currency: "inr",
      metadata: { courseId: courseId.toString(), userId: req.user._id.toString() },
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret, course });
  } catch (err) {
    // Stripe not configured → simulate payment for demo
    if (err.message && err.message.includes("No API key")) {
      const { courseId } = req.body;
      const enrollment = await Enrollment.create({
        userId: req.user._id,
        courseId,
        paymentStatus: "paid",
        paymentId: "demo_" + Date.now(),
      });
      await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });
      return res.status(201).json({ success: true, enrollment, message: "Enrolled (demo payment)!" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Confirm payment and enroll
// @route POST /api/enroll/confirm
exports.confirmPayment = async (req, res) => {
  try {
    const { courseId, paymentIntentId } = req.body;

    const existing = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (existing) return res.json({ success: true, enrollment: existing });

    const enrollment = await Enrollment.create({
      userId: req.user._id,
      courseId,
      paymentStatus: "paid",
      paymentId: paymentIntentId,
    });
    await Course.findByIdAndUpdate(courseId, { $inc: { totalStudents: 1 } });
    res.status(201).json({ success: true, enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get user's enrollments
// @route GET /api/enrollments
exports.getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user._id })
      .populate({ path: "courseId", populate: { path: "instructor", select: "name avatar" } });
    res.json({ success: true, enrollments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update lesson progress
// @route PUT /api/enroll/progress
exports.updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (!enrollment) return res.status(404).json({ success: false, message: "Not enrolled" });

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const totalLessons = await Lesson.countDocuments({ courseId });
    enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);
    enrollment.completed = enrollment.progress === 100;
    await enrollment.save();

    res.json({ success: true, enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Check enrollment status
// @route GET /api/enroll/check/:courseId
exports.checkEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId: req.params.courseId });
    res.json({ success: true, enrolled: !!enrollment, enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
