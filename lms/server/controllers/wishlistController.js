const User = require("../models/User");

// @desc  Toggle wishlist
// @route POST /api/wishlist/:courseId
exports.toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const courseId = req.params.courseId;
    const idx = user.wishlist.indexOf(courseId);

    if (idx === -1) {
      user.wishlist.push(courseId);
    } else {
      user.wishlist.splice(idx, 1);
    }
    await user.save();
    res.json({ success: true, wishlist: user.wishlist, added: idx === -1 });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get wishlist
// @route GET /api/wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "wishlist",
      populate: { path: "instructor", select: "name avatar" },
    });
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
