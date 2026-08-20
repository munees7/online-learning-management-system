const express = require("express");
const router = express.Router();
const { createLesson, getLessons, updateLesson, deleteLesson } = require("../controllers/lessonController");
const { protect, authorize } = require("../middleware/auth");

router.post("/", protect, authorize("instructor", "admin"), createLesson);
router.get("/:courseId", protect, getLessons);
router.put("/:id", protect, authorize("instructor", "admin"), updateLesson);
router.delete("/:id", protect, authorize("instructor", "admin"), deleteLesson);

module.exports = router;
