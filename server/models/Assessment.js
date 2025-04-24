const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }
});

const assessmentSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  totalMarks: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  numberOfQuestions: { type: Number, required: true },
  questions: [questionSchema]
});

module.exports = mongoose.model('Assessment', assessmentSchema);
