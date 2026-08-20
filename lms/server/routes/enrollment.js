const express = require("express");
const router = express.Router();
const { enrollCourse, confirmPayment, getEnrollments, updateProgress, checkEnrollment } = require("../controllers/enrollmentController");
const { protect } = require("../middleware/auth");

router.post("/", protect, enrollCourse);
router.post("/confirm", protect, confirmPayment);
router.get("/", protect, getEnrollments);
router.put("/progress", protect, updateProgress);
router.get("/check/:courseId", protect, checkEnrollment);

module.exports = router;
