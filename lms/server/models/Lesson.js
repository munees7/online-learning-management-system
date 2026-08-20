const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    videoUrl: { type: String, default: "" },
    content: { type: String, default: "" },
    duration: { type: Number, default: 0 }, // in minutes
    order: { type: Number, required: true },
    isPreview: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
