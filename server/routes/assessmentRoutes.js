const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');
const Course = require('../models/CourseCreation');
const User = require('../models/User');
const authMiddleware = require('../middlewares/authMiddleware')

// Admin creates an assessment
router.post('/create/:courseId', authMiddleware, async (req, res) => {
  const { courseId } = req.params;
  const { totalMarks, passingMarks, numberOfQuestions, questions } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (user.Role !== 'Admin') return res.status(403).json({ message: 'Only admin can create assessments' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const assessment = new Assessment({
      courseId,
      totalMarks,
      passingMarks,
      numberOfQuestions,
      questions
    });

    await assessment.save();
    res.status(201).json({ message: 'Assessment created successfully', assessment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin edits an existing assessment through courseId
router.put('/edit/:courseId', authMiddleware, async (req, res) => {
  const { courseId } = req.params;
  const { totalMarks, passingMarks, numberOfQuestions, questions } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (user.Role !== 'Admin') return res.status(403).json({ message: 'Only admin can edit assessments' });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Find the assessment by courseId
    const assessment = await Assessment.findOne({ courseId });
    if (!assessment) return res.status(404).json({ message: 'Assessment not found for this course' });

    // Update fields
    assessment.totalMarks = totalMarks;
    assessment.passingMarks = passingMarks;
    assessment.numberOfQuestions = numberOfQuestions;
    assessment.questions = questions;

    await assessment.save();
    res.status(200).json({ message: 'Assessment updated successfully', assessment });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get assessment by courseId
const mongoose = require('mongoose');

router.get('/:courseId', authMiddleware, async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID format' });
  }

  try {
    console.log('Fetching assessment for courseId:', courseId);
    const assessment = await Assessment.findOne({ courseId });

    if (!assessment) {
      console.log('Assessment not found for courseId:', courseId);
      return res.status(404).json({ message: 'Assessment not found for this course' });
    }

    res.status(200).json({ assessment });
  } catch (err) {
    console.error('Error fetching assessment:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});





module.exports = router;
