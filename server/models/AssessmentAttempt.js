const mongoose = require('mongoose');

const assessmentAttemptSchema = new mongoose.Schema({
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AssessmentQuestion',
      required: true
    },
    selectedOption: {
      type: String,
      required: true
    }
  }],
  totalMarks: {
    type: Number,
    required: true
  },
  passingMarks: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  isPassed: {
    type: Boolean,
    default: false
  },
  isAssessmentCompleted: {
    type: Boolean,
    default: false
  },
  submissionDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
