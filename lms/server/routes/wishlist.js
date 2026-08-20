const express = require("express");
const router = express.Router();
const { toggleWishlist, getWishlist } = require("../controllers/wishlistController");
const { protect } = require("../middleware/auth");

router.post("/:courseId", protect, toggleWishlist);
router.get("/", protect, getWishlist);

module.exports = router;
