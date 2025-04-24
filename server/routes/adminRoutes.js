const express = require("express")
const router = express.Router()
const User = require("../models/User")
const Course = require("../models/CourseCreation")
const CourseRequest = require("../models/CourseRequest")
const AssignedCourse = require("../models/AssignedCourse")
const Assessment = require("../models/Assessment")
const AssessmentAttempt = require("../models/AssessmentAttempt")
const CourseRating = require("../models/CourseRating")
const authMiddleware = require("../middlewares/authMiddleware")

// Get all users
router.get("/users", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Admin") {
      return res.status(403).json({ message: "Only admins can access this" })
    }

    const users = await User.find({Role:"Employee"}).select("-password")
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message })
  }
})


// Get all courses with their stats
router.get("/courses", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.Role !== "Admin") {
      return res.status(403).json({ message: "Only admins can access this" });
    }

    const courses = await Course.find().populate("createdBy", "Name email");

    const courseStats = await Promise.all(
      courses.map(async (course) => {
        // Get assignment stats
        const assignments = await AssignedCourse.find({ courseId: course._id });
        const totalAssigned = assignments.length;
        const completed = assignments.filter((a) => a.isCompleted).length;

        // Get assessment stats
        const assessments = await Assessment.find({ courseId: course._id });
        const hasAssessment = assessments.length > 0;
        const assessmentAttempts = await AssessmentAttempt.find({
          assessmentId: { $in: assessments.map((a) => a._id) },
        });
        const passedAttempts = assessmentAttempts.filter((a) => a.isPassed).length;

        // Get rating stats
        const ratings = await CourseRating.find({ courseId: course._id });
        const averageRating =
          ratings.length > 0 ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length : 0;

        return {
          ...course.toObject(),
          hasAssessment, // ✅ Include this
          stats: {
            totalAssigned,
            completed,
            completionRate: totalAssigned > 0 ? (completed / totalAssigned) * 100 : 0,
            assessmentsPassed: passedAttempts,
            averageRating,
            totalRatings: ratings.length,
          },
        };
      })
    );

    res.status(200).json(courseStats);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses", error: err.message });
  }
});


// Get all employee progress (admin view)
router.get("/employee-progress", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Admin") {
      return res.status(403).json({ message: "Only admins can access this" })
    }

    const employees = await User.find({ Role: "Employee" }).select("-password")

    const employeeProgress = await Promise.all(
      employees.map(async (employee) => {
        const assignments = await AssignedCourse.find({ employeeId: employee._id }).populate("courseId")

        const assignmentDetails = await Promise.all(
          assignments.map(async (assignment) => {
            // Get assessment attempts
            const assessment = await Assessment.findOne({ courseId: assignment.courseId._id })
            let assessmentAttempt = null

            if (assessment) {
              assessmentAttempt = await AssessmentAttempt.findOne({
                assessmentId: assessment._id,
                employeeId: employee._id,
              })
            }

            return {
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
            }
          }),
        )

        return {
          employee: {
            id: employee._id,
            name: employee.Name,
            email: employee.email,
            designation: employee.Designation,
          },
          coursesAssigned: assignments.length,
          coursesCompleted: assignments.filter((a) => a.isCompleted).length,
          courses: assignmentDetails,
        }
      }),
    )

    res.status(200).json(employeeProgress)
  } catch (err) {
    res.status(500).json({ message: "Error fetching employee progress", error: err.message })
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

// Get dashboard stats
router.get("/dashboard-stats", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Admin") {
      return res.status(403).json({ message: "Only admins can access this" })
    }

    // User stats
    const totalUsers = await User.countDocuments()
    const totalAdmins = await User.countDocuments({ Role: "Admin" })
    const totalManagers = await User.countDocuments({ Role: "Manager" })
    const totalEmployees = await User.countDocuments({ Role: "Employee" })

    // Course stats
    const totalCourses = await Course.countDocuments()
    const totalRequests = await CourseRequest.countDocuments()
    const pendingRequests = await CourseRequest.countDocuments({ status: "Pending" })
    const approvedRequests = await CourseRequest.countDocuments({ status: "Approved" })
    const rejectedRequests = await CourseRequest.countDocuments({ status: "Rejected" })

    // Assignment stats
    const totalAssignments = await AssignedCourse.countDocuments()
    const completedAssignments = await AssignedCourse.countDocuments({ isCompleted: true })

    // Assessment stats
    const totalAssessments = await Assessment.countDocuments()
    const totalAttempts = await AssessmentAttempt.countDocuments()
    const passedAttempts = await AssessmentAttempt.countDocuments({ isPassed: true })

    // Rating stats
    const totalRatings = await CourseRating.countDocuments()
    const ratings = await CourseRating.find()
    const averageRating = ratings.length > 0 ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length : 0

    res.status(200).json({
      users: {
        total: totalUsers,
        admins: totalAdmins,
        managers: totalManagers,
        employees: totalEmployees,
      },
      courses: {
        total: totalCourses,
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          approved: approvedRequests,
          rejected: rejectedRequests,
        },
      },
      assignments: {
        total: totalAssignments,
        completed: completedAssignments,
        completionRate: totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0,
      },
      assessments: {
        total: totalAssessments,
        attempts: totalAttempts,
        passed: passedAttempts,
        passRate: totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0,
      },
      ratings: {
        total: totalRatings,
        average: averageRating,
      },
    })
  } catch (err) {
    res.status(500).json({ message: "Error fetching dashboard stats", error: err.message })
  }
})

module.exports = router
