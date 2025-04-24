const express = require("express")
const router = express.Router()
const AssignedCourse = require("../models/AssignedCourse")
const Course = require("../models/CourseCreation")
const User = require("../models/User")
const CourseRequest = require("../models/CourseRequest")
const Assessment = require("../models/Assessment")
const AssessmentAttempt = require("../models/AssessmentAttempt")
const CourseRating = require("../models/CourseRating")
const authMiddleware = require("../middlewares/authMiddleware")

// Get all course requests by the manager
router.get("/my-requests", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Manager") {
      return res.status(403).json({ message: "Only managers can access this" })
    }

    const requests = await CourseRequest.find({ managerId: req.user.userId })
    res.status(200).json(requests)
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests", error: err.message })
  }
})

// Get all employees under the manager
router.get("/employees", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Manager") {
      return res.status(403).json({ message: "Only managers can access this" })
    }

    const employees = await User.find({ Role: "Employee" }).select("-password")
    res.status(200).json(employees)
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees", error: err.message })
  }
})
// Get employee by ID
router.get("/employee/:employeeId", authMiddleware, async (req, res) => {
  const { employeeId } = req.params;

  try {
    const user = await User.findById(req.user.userId);
    if (user.Role !== "Manager") {
      return res.status(403).json({ message: "Only managers can access this" });
    }

    const employee = await User.findById(employeeId).select("-password");
    if (!employee || employee.Role !== "Employee") {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      id: employee._id,
      name: employee.Name,
      email: employee.email,
      designation: employee.Designation,
      // Add any other fields you want to send
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee", error: err.message });
  }
});

// Get all employees already assigned to a course
router.get("/course/:courseId/assigned-employees", authMiddleware, async (req, res) => {
  try {
    const assigned = await AssignedCourse.find({ courseId: req.params.courseId }).select("employeeId");
    const assignedEmployeeIds = assigned.map(item => item.employeeId.toString());
    res.status(200).json(assignedEmployeeIds);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch assigned employees", error: err.message });
  }
});

// Get employee progress for a specific course
router.get("/employee-progress/:employeeId/:courseId", authMiddleware, async (req, res) => {
  const { employeeId, courseId } = req.params

  try {
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Manager") {
      return res.status(403).json({ message: "Only managers can access this" })
    }

    const employee = await User.findById(employeeId)
    if (!employee || employee.Role !== "Employee") {
      return res.status(404).json({ message: "Employee not found" })
    }

    const assignment = await AssignedCourse.findOne({
      courseId,
      employeeId,
    }).populate("courseId")

    if (!assignment) {
      return res.status(404).json({ message: "Course not assigned to this employee" })
    }

    // Get assessment attempts if any
    const assessment = await Assessment.findOne({ courseId })
    let assessmentAttempt = null

    if (assessment) {
      assessmentAttempt = await AssessmentAttempt.findOne({
        assessmentId: assessment._id,
        employeeId,
      })
    }

    // Get course rating if any
    const rating = await CourseRating.findOne({
      courseId,
      employeeId,
    })

    res.status(200).json({
      employee: {
        id: employee._id,
        name: employee.Name,
        email: employee.email,
      },
      course: assignment.courseId,
      progress: assignment.progress,
      isCompleted: assignment.isCompleted,
      completedAt: assignment.completedAt,
      assessment: assessmentAttempt
        ? {
            score: assessmentAttempt.score,
            totalMarks: assessmentAttempt.totalMarks,
            isPassed: assessmentAttempt.isPassed,
            submissionDate: assessmentAttempt.submissionDate,
          }
        : null,
      rating: rating
        ? {
            rating: rating.rating,
            review: rating.review,
            createdAt: rating.createdAt,
          }
        : null,
    })
  } catch (err) {
    res.status(500).json({ message: "Error fetching progress", error: err.message })
  }
})

// Get all employee progress for all assigned courses
router.get("/all-employee-progress", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Manager") {
      return res.status(403).json({ message: "Only managers can access this" })
    }

    const assignments = await AssignedCourse.find().populate("courseId").populate({
      path: "employeeId",
      select: "Name email ID Designation",
    })

    const progressData = await Promise.all(
      assignments.map(async (assignment) => {
        // Get assessment attempts if any
        const assessment = await Assessment.findOne({ courseId: assignment.courseId._id })
        let assessmentAttempt = null

        if (assessment) {
          assessmentAttempt = await AssessmentAttempt.findOne({
            assessmentId: assessment._id,
            employeeId: assignment.employeeId._id,
          })
        }

        // Get course rating if any
        const rating = await CourseRating.findOne({
          courseId: assignment.courseId._id,
          employeeId: assignment.employeeId._id,
        })

        return {
          employee: assignment.employeeId,
          course: assignment.courseId,
          progress: assignment.progress,
          isCompleted: assignment.isCompleted,
          completedAt: assignment.completedAt,
          assessment: assessmentAttempt
            ? {
                score: assessmentAttempt.score,
                totalMarks: assessmentAttempt.totalMarks,
                isPassed: assessmentAttempt.isPassed,
                submissionDate: assessmentAttempt.submissionDate,
              }
            : null,
          rating: rating
            ? {
                rating: rating.rating,
                review: rating.review,
                createdAt: rating.createdAt,
              }
            : null,
        }
      }),
    )

    res.status(200).json(progressData)
  } catch (err) {
    res.status(500).json({ message: "Error fetching progress data", error: err.message })
  }
})

// Get course ratings
router.get("/course-ratings/:courseId", authMiddleware, async (req, res) => {
  const { courseId } = req.params

  try {
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Manager" && user.Role !== "Admin") {
      return res.status(403).json({ message: "Only managers and admins can access this" })
    }

    const ratings = await CourseRating.find({ courseId }).populate({
      path: "employeeId",
      select: "Name email ID",
    })

    // Calculate average rating
    const totalRatings = ratings.length
    const averageRating = totalRatings > 0 ? ratings.reduce((sum, item) => sum + item.rating, 0) / totalRatings : 0

    res.status(200).json({
      courseId,
      averageRating,
      totalRatings,
      ratings,
    })
  } catch (err) {
    res.status(500).json({ message: "Error fetching ratings", error: err.message })
  }
})

module.exports = router
