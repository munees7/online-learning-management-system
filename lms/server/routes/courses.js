const express = require("express");
const router = express.Router();
const {
  getCourses, getCourse, createCourse, updateCourse, deleteCourse,
  getInstructorCourses, getFeaturedCourses,
} = require("../controllers/courseController");
const { protect, authorize } = require("../middleware/auth");

router.get("/featured", getFeaturedCourses);
router.get("/instructor/my", protect, authorize("instructor", "admin"), getInstructorCourses);
router.get("/", getCourses);
router.get("/:id", getCourse);
router.post("/", protect, authorize("instructor", "admin"), createCourse);
router.put("/:id", protect, authorize("instructor", "admin"), updateCourse);
router.delete("/:id", protect, authorize("instructor", "admin"), deleteCourse);

module.exports = router;
