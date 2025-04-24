const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    concept: { type: String, required: true },
    duration: { type: String, required: true },
    videoLink: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: "CourseRequest", required: true },
    pdfLink: { type: String },
  },
  { timestamps: true }
);


const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
