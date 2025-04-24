const express = require('express');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Manager views all assessments with answers for a course
router.get('/course/:courseId', authMiddleware, async (req, res) => {
  const { courseId } = req.params;
  try {
    const user = await User.findById(req.user.userId);
    if (user.Role !== 'Manager') {
      return res.status(403).json({ message: 'Only managers can view assessments' });
    }

    // Find assessments for the course
    const assessments = await Assessment.find({ courseId });
    if (!assessments.length) { // Check if the assessments array is empty
      return res.status(404).json({ message: 'No assessments found for this course' });
    }

    // Send the assessments with answers
    res.status(200).json(assessments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assessments', error: err.message });
  }
});



module.exports = router;
