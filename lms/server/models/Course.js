const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, default: 0 },
    isFree: { type: Boolean, default: true },
    thumbnail: { type: String, default: "" },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    ratings: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
    language: { type: String, default: "English" },
    requirements: [String],
    whatYouLearn: [String],
    isPublished: { type: Boolean, default: false },
    tags: [String],
  },
  { timestamps: true }
);

// Auto-set isFree based on price
courseSchema.pre("save", function (next) {
  this.isFree = this.price === 0;
  next();
});

module.exports = mongoose.model("Course", courseSchema);
