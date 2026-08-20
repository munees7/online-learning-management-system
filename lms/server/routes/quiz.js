const express = require("express");
const router = express.Router();
const { getQuiz, submitQuiz, getCertificate, getMyCertificates, createQuiz, getMyAttempt } = require("../controllers/quizController");
const { protect, authorize } = require("../middleware/auth");

router.get("/certificates/my", protect, getMyCertificates);
router.get("/certificate/:courseId", protect, getCertificate);
router.get("/attempt/:courseId", protect, getMyAttempt);
router.get("/:courseId", protect, getQuiz);
router.post("/submit", protect, submitQuiz);
router.post("/", protect, authorize("instructor", "admin"), createQuiz);

module.exports = router;
