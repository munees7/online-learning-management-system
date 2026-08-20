const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    answers: [{ questionId: String, selectedAnswer: Number }],
    score: { type: Number, required: true }, // percentage
    passed: { type: Boolean, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
