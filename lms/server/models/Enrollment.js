const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    paymentStatus: { type: String, enum: ["free", "paid", "pending"], default: "free" },
    paymentId: { type: String, default: "" },
    progress: { type: Number, default: 0 }, // percentage 0-100
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent duplicate enrollments
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
