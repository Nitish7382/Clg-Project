const mongoose = require("mongoose")

const courseRatingSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Ensure one rating per employee per course
courseRatingSchema.index({ courseId: 1, employeeId: 1 }, { unique: true })

module.exports = mongoose.model("CourseRating", courseRatingSchema)
