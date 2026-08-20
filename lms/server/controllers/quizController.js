const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Certificate = require('../models/Certificate');
const Enrollment = require('../models/Enrollment');
const crypto = require('crypto');

exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ courseId: req.params.courseId });
    if (!quiz) return res.status(404).json({ success: false, message: 'No quiz for this course' });
    const safeQuiz = {
      _id: quiz._id, courseId: quiz.courseId, title: quiz.title, passingScore: quiz.passingScore,
      questions: quiz.questions.map((q) => ({ _id: q._id, question: q.question, options: q.options, points: q.points })),
    };
    res.json({ success: true, quiz: safeQuiz });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, courseId, answers } = req.body;
    const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (!enrollment) return res.status(403).json({ success: false, message: 'Not enrolled' });
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });
    let correct = 0;
    quiz.questions.forEach((q) => {
      const ans = answers.find((a) => a.questionId === q._id.toString());
      if (ans && ans.selectedAnswer === q.correctAnswer) correct++;
    });
    const total = quiz.questions.length;
    const score = Math.round((correct / total) * 100);
    const passed = score >= quiz.passingScore;
    const attempt = await QuizAttempt.create({ userId: req.user._id, quizId, courseId, answers, score, passed, totalQuestions: total, correctAnswers: correct });
    let certificate = null;
    if (passed) {
      const existing = await Certificate.findOne({ userId: req.user._id, courseId });
      if (!existing) {
        const certId = 'CERT-' + crypto.randomBytes(6).toString('hex').toUpperCase();
        certificate = await Certificate.create({ userId: req.user._id, courseId, certificateId: certId, score });
      } else { certificate = existing; }
    }
    res.json({ success: true, score, passed, correct, total, attempt, certificate });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findOne({ userId: req.user._id, courseId: req.params.courseId })
      .populate('userId', 'name email')
      .populate({ path: 'courseId', populate: { path: 'instructor', select: 'name' } });
    if (!cert) return res.status(404).json({ success: false, message: 'No certificate found' });
    res.json({ success: true, certificate: cert });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.find({ userId: req.user._id })
      .populate({ path: 'courseId', populate: { path: 'instructor', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, certificates: certs });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.createQuiz = async (req, res) => {
  try {
    const existing = await Quiz.findOne({ courseId: req.body.courseId });
    if (existing) {
      const updated = await Quiz.findByIdAndUpdate(existing._id, req.body, { new: true });
      return res.json({ success: true, quiz: updated });
    }
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, quiz });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.getMyAttempt = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({ userId: req.user._id, courseId: req.params.courseId }).sort({ score: -1 });
    res.json({ success: true, attempt });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};