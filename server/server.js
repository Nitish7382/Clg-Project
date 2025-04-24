const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")

const authRoutes = require("./routes/authRoutes")
const courseRequestRoutes = require("./routes/courseRequestRoutes")
const courseRoutes = require("./routes/courseCreationRoutes")
const assessmentRoutes = require("./routes/assessmentRoutes")
const courseAssign = require("./routes/courseAssign")
const viewAssesments = require("./routes/viewAssesmentsRoutes")
const employeeRoutes = require("./routes/employeeRoutes")
const managerRoutes = require("./routes/managerRoutes")
const adminRoutes = require("./routes/adminRoutes")
const uploadRoutes = require("./routes/uploadRoutes") // Add this line

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" })
})

// API routes
app.use("/api/auth", authRoutes) // Authentication
app.use("/api/course-requests", courseRequestRoutes) // Course requests
app.use("/api/courses", courseRoutes) // Course management
app.use("/api/assessments", assessmentRoutes) // Assessments
app.use("/api/course", courseAssign) // Course assignment
app.use("/api/view-assessments", viewAssesments) // View assessments
app.use("/api/employee", employeeRoutes) // Employee routes
app.use("/api/manager", managerRoutes) // Manager routes
app.use("/api/admin", adminRoutes) // Admin routes
app.use("/api/upload", uploadRoutes) // Upload routes - Add this line

// Add this line after the existing routes to ensure the route is properly registered
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`)
  next()
})

// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : "Internal Server Error",
  })
})

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected")
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch((err) => console.error("MongoDB connection error:", err))

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...")
  console.log(err.name, err.message)
  process.exit(1)
})
