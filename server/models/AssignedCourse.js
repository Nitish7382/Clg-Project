const mongoose = require('mongoose');

const assignedCourseSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now, // Ensure the date field is consistent
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('AssignedCourse', assignedCourseSchema);
