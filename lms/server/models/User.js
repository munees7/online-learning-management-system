const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, minlength: 6 }, // optional for Google OAuth users
    googleId: { type: String, default: null }, // Google OAuth ID
    role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },
    avatar: { type: String, default: "" },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

// Hash password before saving (only if password exists)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false; // Google OAuth user has no password
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
