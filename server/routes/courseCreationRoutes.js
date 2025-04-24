const express = require("express");
const jwt = require("jsonwebtoken");
const Course = require("../models/CourseCreation");
const CourseRequest = require("../models/CourseRequest");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const { handleUpload } = require("../middlewares/uploadMiddleware");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Admin creates course after approval
// Admin creates course after approval
router.post(
  "/create/:requestId",
  authMiddleware,
  handleUpload("pdf"),
  async (req, res) => {
    const { requestId } = req.params;
    const {
      title,
      description,
      concept,
      duration,
      videoLink,
      pdfLink: bodyPdfLink,
    } = req.body;

    // Use uploaded file path if a file was uploaded, otherwise use the pdfLink from the request body
    const pdfLink = req.file
      ? `/uploads/pdfs/${req.file.filename}`
      : bodyPdfLink || null;

    console.log("Request ID: ", requestId);
    console.log("Received Body: ", req.body);
    console.log("Uploaded PDF Link: ", pdfLink);

    try {
      const user = await User.findById(req.user.userId);
      if (user.Role !== "Admin") {
        return res
          .status(403)
          .json({ message: "Only admins can create courses" });
      }

      const courseRequest = await CourseRequest.findById(requestId);
      if (!courseRequest || courseRequest.status !== "Approved") {
        return res
          .status(400)
          .json({ message: "Course request is not approved or doesn't exist" });
      }

      const existingCourse = await Course.findOne({ requestId });
      if (existingCourse) {
        return res.status(409).json({
          message: "Course already created for this request",
          courseId: existingCourse._id,
          title: existingCourse.title,
        });
      }

      // Make PDF optional, no need to check for a PDF if it's not provided
      const newCourse = new Course({
        title,
        description,
        concept,
        duration,
        videoLink,
        createdBy: req.user.userId,
        requestId,
        pdfLink, // Can be null or the path to the uploaded PDF
      });

      await newCourse.save();

      res.status(201).json({
        courseId: newCourse._id,
        title: newCourse.title,
        description: newCourse.description,
        concept: newCourse.concept,
        duration: newCourse.duration,
        videoLink: newCourse.videoLink,
        pdfLink: newCourse.pdfLink,
        createdBy: newCourse.createdBy,
        requestId: newCourse.requestId,
        message: "Course created successfully",
      });
    } catch (err) {
      console.error("Error during course creation:", err); // Log the error for debugging
      res
        .status(500)
        .json({ message: "Error creating course", error: err.message });
    }
  }
);

// Admin edits existing course
router.put(
  "/edit/:courseId",
  authMiddleware,
  handleUpload("pdf"),
  async (req, res) => {
    const { courseId } = req.params;
    const {
      title,
      description,
      concept,
      duration,
      videoLink,
      pdfLink: bodyPdfLink,
    } = req.body;

    // Use uploaded file path if a file was uploaded, otherwise use the pdfLink from the request body
    const pdfLink = req.file
      ? `/uploads/pdfs/${req.file.filename}`
      : bodyPdfLink;

    if (!title || !description || !concept || !duration) {
      return res
        .status(400)
        .json({ message: "All course fields are required" });
    }

    try {
      const user = await User.findById(req.user.userId);
      if (user.Role !== "Admin")
        return res
          .status(403)
          .json({ message: "Only admins can edit courses" });

      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });

      // Delete old PDF if a new one is uploaded
      if (req.file && course.pdfLink) {
        const oldPdfPath = path.join(
          __dirname,
          "..",
          "uploads",
          "pdfs",
          path.basename(course.pdfLink)
        );
        if (fs.existsSync(oldPdfPath)) {
          fs.unlinkSync(oldPdfPath);
        }
      }

      // Update course fields
      course.title = title || course.title;
      course.description = description || course.description;
      course.concept = concept || course.concept;
      course.duration = duration || course.duration;
      course.videoLink = videoLink || course.videoLink;

      // Update pdfLink only if a new file was uploaded or a new link was provided
      if (pdfLink) {
        course.pdfLink = pdfLink;
      }

      await course.save();
      res.status(200).json({
        message: "Course updated successfully",
        course: {
          id: course._id,
          title: course.title,
          description: course.description,
          concept: course.concept,
          duration: course.duration,
          videoLink: course.videoLink,
          pdfLink: course.pdfLink,
        },
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating course", error: err.message });
    }
  }
);

// Manager views all created courses
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.Role !== "Manager") {
      return res
        .status(403)
        .json({ message: "Only managers can view courses" });
    }

    const courses = await Course.find().populate("createdBy", "name");
    res.status(200).json(courses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching courses", error: err.message });
  }
});


module.exports = router;
