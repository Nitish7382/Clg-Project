// routes/employeeRoutes.js
const express = require("express")
const router = express.Router()
const AssignedCourse = require("../models/AssignedCourse")
const Course = require("../models/CourseCreation")
const User = require("../models/User")
const Assessment = require("../models/Assessment")
const AssessmentAttempt = require("../models/AssessmentAttempt")
const CourseRating = require("../models/CourseRating")
const authMiddleware = require("../middlewares/authMiddleware")
const mongoose = require("mongoose")


// Get assigned courses for logged-in employee
router.get("/my-courses", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.Role !== "Employee") {
      return res.status(403).json({ message: "Only employees can access this" });
    }

    // Fetch assigned courses for the logged-in employee
    const assignedCourses = await AssignedCourse.find({ employeeId: req.user.userId }).populate("courseId");

    // Add isCompletedAssessment and isRated info
    const coursesWithStatus = await Promise.all(
      assignedCourses.map(async (assignment) => {
        const assessment = await Assessment.findOne({ courseId: assignment.courseId._id });
        let isCompletedAssessment = false;
        let isRated = false;

        if (assessment) {
          const attempt = await AssessmentAttempt.findOne({
            assessmentId: assessment._id,
            employeeId: req.user.userId,
            isAssessmentCompleted: true,
          });
          isCompletedAssessment = !!attempt;
        }

        // Check if the employee has rated the course
        const rating = await CourseRating.findOne({
          courseId: assignment.courseId._id,
          employeeId: req.user.userId,
        });

        if (rating) {
          isRated = true;
        }

        return {
          ...assignment.toObject(),
          isCompletedAssessment,
          isRated, // Add the isRated attribute
        };
      })
    );

    res.status(200).json(coursesWithStatus);
  } catch (err) {
    res.status(500).json({ message: "Error fetching assigned courses", error: err.message });
  }
});


// Update course progress
router.patch("/update-progress/:courseId", authMiddleware, async (req, res) => {
  try {
    const { progress } = req.body
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ message: "Progress must be between 0 and 100" })
    }

    const user = await User.findById(req.user.userId)
    if (user.Role !== "Employee") {
      return res.status(403).json({ message: "Only employees can update course progress" })
    }

    const courseId = req.params.courseId
    const assignment = await AssignedCourse.findOne({ courseId, employeeId: req.user.userId })

    if (!assignment) return res.status(404).json({ message: "Course not assigned" })

    assignment.progress = progress

    // If progress is 100%, mark as completed
    if (progress === 100 && !assignment.isCompleted) {
      assignment.isCompleted = true
      assignment.completedAt = new Date()
    }

    await assignment.save()

    res.status(200).json({
      message: "Progress updated successfully",
      progress: assignment.progress,
      isCompleted: assignment.isCompleted,
    })
  } catch (err) {
    res.status(500).json({ message: "Error updating progress", error: err.message })
  }
})

// POST /api/employees/complete-course/:courseId
router.post("/complete-course/:courseId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Employee") {
      return res.status(403).json({ message: "Only employees can complete courses" })
    }

    const courseId = req.params.courseId
    const assignment = await AssignedCourse.findOne({ courseId, employeeId: req.user.userId })

    if (!assignment) return res.status(404).json({ message: "Course not assigned" })

    // Mark the course as completed when the employee has completed it
    assignment.isCompleted = true
    assignment.progress = 100
    assignment.completedAt = new Date()
    await assignment.save()

    res.status(200).json({ message: "Course marked as completed" })
  } catch (err) {
    res.status(500).json({ message: "Error completing course", error: err.message })
  }
})

// Get assessments for a specific course (must be assigned to this employee)
router.get("/:courseId/assessments", authMiddleware, async (req, res) => {
  const { courseId } = req.params

  try {
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Employee") {
      return res.status(403).json({ message: "Only employees can access this" })
    }

    const isAssigned = await AssignedCourse.findOne({
      courseId,
      employeeId: req.user.userId,
    })

    if (!isAssigned) {
      return res.status(403).json({ message: "Course not assigned to you" })
    }

    const assessments = await Assessment.find({ courseId })

    // Remove correct answers before sending
    const filteredAssessments = assessments.map((a) => ({
      _id: a._id,
      courseId: a.courseId,
      totalMarks: a.totalMarks,
      passingMarks: a.passingMarks,
      numberOfQuestions: a.numberOfQuestions,
      questions: a.questions.map((q) => ({
        _id: q._id,
        questionText: q.questionText,
        options: q.options,
        // Do NOT include `correctAnswer`
      })),
    }))

    res.status(200).json(filteredAssessments)
  } catch (err) {
    res.status(500).json({ message: "Error fetching assessments", error: err.message })
  }
})

// POST /api/employees/submit-assessment/:assessmentId
router.post("/submit-assessment/:assessmentId", authMiddleware, async (req, res) => {
  const { answers } = req.body
  const { assessmentId } = req.params

  try {
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Employee") {
      return res.status(403).json({ message: "Only employees can submit assessments" })
    }

    const existingAttempt = await AssessmentAttempt.findOne({
      assessmentId,
      employeeId: req.user.userId,
    })

    if (existingAttempt) {
      return res.status(400).json({ message: "You have already attempted this assessment" })
    }

    const assessment = await Assessment.findById(assessmentId)
    if (!assessment) return res.status(404).json({ message: "Assessment not found" })

    let score = 0

    const answerArray = Object.entries(answers).map(([questionId, selectedOption]) => {
      const question = assessment.questions.id(questionId)
      if (question && Number.parseInt(question.correctAnswer) === Number.parseInt(selectedOption)) {
        score += assessment.totalMarks / assessment.numberOfQuestions
      }

      return {
        questionId,
        selectedOption,
      }
    })

    const isPassed = score >= assessment.passingMarks

    const attempt = new AssessmentAttempt({
      assessmentId,
      employeeId: req.user.userId,
      answers: answerArray,
      totalMarks: assessment.totalMarks,
      passingMarks: assessment.passingMarks,
      score: score,
      isPassed: isPassed,
      isAssessmentCompleted: true,
      submissionDate: new Date(),
    })

    await attempt.save()

    res.status(200).json({
      message: "Assessment submitted",
      score,
      totalMarks: assessment.totalMarks,
      passingMarks: assessment.passingMarks,
      isPassed,
    })
  } catch (err) {
    res.status(500).json({ message: "Error submitting assessment", error: err.message })
  }
})

// Get courses available for rating
router.get("/available-for-rating", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Employee") {
      return res.status(403).json({ message: "Only employees can access this" })
    }

    // Find all courses assigned to this employee
    const assignedCourses = await AssignedCourse.find({
      employeeId: req.user.userId,
    }).populate("courseId")

    // Format the response to show which courses can be rated
    const coursesForRating = assignedCourses.map((assignment) => ({
      courseId: assignment.courseId._id,
      title: assignment.courseId.title,
      isCompleted: assignment.isCompleted,
      progress: assignment.progress,
      assignedAt: assignment.assignedAt,
    }))

    res.status(200).json({
      message: "These are the courses you can rate",
      courses: coursesForRating,
    })
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses for rating", error: err.message })
  }
})

// Rate a course (only after passing assessment or completing course)
router.post("/rate-course/:courseId", authMiddleware, async (req, res) => {
  const { rating, review } = req.body
  const { courseId } = req.params

  try {
    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }

    const user = await User.findById(req.user.userId)
    if (user.Role !== "Employee") {
      return res.status(403).json({ message: "Only employees can rate courses" })
    }

    // Validate courseId format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        message: "Invalid course ID format",
        tip: "Use the /api/employee/available-for-rating endpoint to see your assigned courses",
      })
    }

    // Log the employeeId and courseId to ensure they are correct
    console.log("Employee ID:", req.user.userId)
    console.log("Course ID:", courseId)

    // Find the assignment to check if the course is assigned
    const assignment = await AssignedCourse.findOne({
      courseId,
      employeeId: req.user.userId,
    })

    // Log the assignment to check if it is being fetched correctly
    console.log("Assignment:", assignment)

    if (!assignment) {
      // Get the courses that are assigned to this employee
      const assignedCourses = await AssignedCourse.find({
        employeeId: req.user.userId,
      }).populate("courseId")

      const assignedCourseIds = assignedCourses.map((ac) => ac.courseId._id.toString())

      return res.status(404).json({
        message: "Course not assigned to you",
        courseIdRequested: courseId,
        assignedCourseIds: assignedCourseIds,
        tip: "Make sure you're using one of your assigned course IDs",
      })
    }

    // Check if the employee has already rated the course
    const existingRating = await CourseRating.findOne({
      courseId,
      employeeId: req.user.userId,
    })

    if (existingRating) {
      existingRating.rating = rating
      existingRating.review = review || existingRating.review
      await existingRating.save()
      return res.status(200).json({
        message: "Rating updated successfully",
        rating: existingRating,
      })
    }

    // Create a new rating for the course
    const newRating = new CourseRating({
      courseId,
      employeeId: req.user.userId,
      rating,
      review: review || "",
      createdAt: new Date(),
    })

    await newRating.save()
    res.status(201).json({
      message: "Course rated successfully",
      rating: newRating,
    })
  } catch (err) {
    console.error("Rating error:", err)
    res.status(500).json({ message: "Error rating course", error: err.message })
  }
})

module.exports = router
