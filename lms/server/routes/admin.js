const express = require("express");
const router = express.Router();
const { getAnalytics, getUsers, updateUser, deleteUser, getAllCourses } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin"));

router.get("/analytics", getAnalytics);
router.get("/users", getUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/courses", getAllCourses);

module.exports = router;
