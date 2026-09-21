const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../utils/emailService");

// Generate JWT token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @desc  Register user
// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    // Prevent direct admin registration without secret
    if (role === "admin") {
      return res.status(403).json({ success: false, message: "Use /api/auth/register-admin to create admin accounts" });
    }

    const user = await User.create({ name, email, password, role: role || "student" });
    const token = generateToken(user._id);

    // Send welcome email — fire and forget, never blocks registration
    sendWelcomeEmail(user);

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Register admin (requires secret key)
// @route POST /api/auth/register-admin
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;

    if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ success: false, message: "Invalid admin secret key" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.create({ name, email, password, role: "admin" });
    const token = generateToken(user._id);

    // Send welcome email — fire and forget, never blocks registration
    sendWelcomeEmail(user);

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Login user
// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Please provide email and password" });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get current user
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ success: true, user });
};

// @desc  Update profile
// @route PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, avatar },
      { new: true, runValidators: true }
    ).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Google OAuth callback — find or create user, return JWT
exports.googleAuthCallback = async (profile) => {
  const { id: googleId, displayName: name, emails, photos } = profile;
  const email = emails[0].value;
  const avatar = photos?.[0]?.value || "";

  let isNewUser = false;

  // Try to find by googleId first, then by email
  let user = await User.findOne({ googleId });
  if (!user) {
    user = await User.findOne({ email });
    if (user) {
      // Existing email/password account — link Google ID, no welcome email
      user.googleId = googleId;
      if (!user.avatar) user.avatar = avatar;
      await user.save();
    } else {
      // Brand new user via Google
      user = await User.create({ name, email, googleId, avatar, role: "student" });
      isNewUser = true;
    }
  }

  // Send welcome email only for brand new accounts
  if (isNewUser) sendWelcomeEmail(user);

  return user;
};
