// models/CourseRequest.js
const mongoose = require('mongoose');

const courseRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  concept: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending' // Initially, it's Pending until the admin approves
  },
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CourseRequest', courseRequestSchema);
