const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile, registerAdmin } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const passport = require("passport");
const jwt = require("jsonwebtoken");

router.post("/register", register);
router.post("/register-admin", registerAdmin);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

// @desc  Start Google OAuth flow
// @route GET /api/auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

// @desc  Google OAuth callback
// @route GET /api/auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    // Redirect to frontend with token in query param; frontend reads it and stores in localStorage
    res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${token}`);
  }
);

module.exports = router;

