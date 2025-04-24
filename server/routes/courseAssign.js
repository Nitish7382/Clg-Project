const express = require('express');
const Course = require('../models/CourseCreation');
const User = require('../models/User');
const AssignedCourse = require('../models/AssignedCourse');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();



// Manager assigns course to multiple employees
router.post('/assign', authMiddleware, async (req, res) => {
  console.log('Request Body:', req.body); // Log the request body for debugging
  const { courseId, employeeIds } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (user.Role !== 'Manager') {
      return res.status(403).json({ message: 'Only managers can assign courses' });
    }

    // Validate that employeeIds is an array
    if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({ message: 'Employee IDs should be an array and not empty' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const assignments = [];
    const errors = [];

    // Loop through employeeIds and assign course to each employee
    for (const employeeId of employeeIds) {
      const employee = await User.findById(employeeId);
      if (!employee || employee.Role !== 'Employee') {
        errors.push({ employeeId, message: 'Invalid employee ID or user is not an employee' });
        continue;
      }

      // Check if course is already assigned to the employee
      const alreadyAssigned = await AssignedCourse.findOne({ courseId, employeeId });
      if (alreadyAssigned) {
        errors.push({
          employeeId,
          message: 'Course is already assigned to this employee',
          assignedOn: alreadyAssigned.assignedAt,
          assignedBy: alreadyAssigned.assignedBy,
        });
        continue;
      }

      // Assign the course
      const newAssignment = new AssignedCourse({
        courseId,
        employeeId,
        assignedBy: user._id, // Logged-in manager assigns the course
        assignedAt: new Date(),
      });

      await newAssignment.save();
      assignments.push(newAssignment);
    }

    // Check if there were any errors
    if (assignments.length === 0) {
      return res.status(400).json({ message: 'No valid assignments made', errors });
    }

    res.status(201).json({
      message: 'Courses assigned successfully',
      assignments,
      errors,
    });
  } catch (err) {
    console.error('Error during assignment:', err); // Log any error during the assignment process
    res.status(500).json({ message: 'Error assigning courses', error: err.message });
  }
});


module.exports = router;
