const express = require("express");
const router = express.Router();
const CourseRequest = require("../models/CourseRequest");
const Course = require("../models/CourseCreation");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

// Create Course Request (Manager only)
router.post("/create", authMiddleware, async (req, res) => {
  const { title, description, concept, duration } = req.body;
  const managerId = req.user.userId;

  try {
    const user = await User.findById(managerId);
    if (user.Role !== "Manager") {
      return res.status(403).json({ message: "Only managers can submit course requests" });
    }

    const newRequest = new CourseRequest({ title, description, concept, duration, managerId });
    await newRequest.save();

    res.status(201).json({
      title,
      description,
      concept,
      duration,
      createdBy: managerId,
      message: "Course creation request submitted successfully"
    });
  } catch (err) {
    res.status(500).json({ message: "Error submitting request", error: err.message });
  }
});

// Admin views all course requests
router.get("/requests", authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (user.Role !== "Admin") {
      return res.status(403).json({ message: "Only admins can view course requests" });
    }

    const requests = await CourseRequest.find().populate({
      path: "managerId",
      select: "Name email ID"
    });

    const requestsWithStatus = await Promise.all(requests.map(async (request) => {
      const course = await Course.findOne({ requestId: request._id });
      return {
        ...request.toObject(),
        courseCreated: !!course,
        courseId: course ? course._id : null
      };
    }));

    res.status(200).json(requestsWithStatus);
  } catch (err) {
    res.status(500).json({ message: "Error fetching course requests", error: err.message });
  }
});

// Admin views a specific course request by ID
router.get("/request/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (user.Role !== "Admin") {
      return res.status(403).json({ message: "Only admins can view course requests" });
    }

    const request = await CourseRequest.findById(id).populate({
      path: "managerId",
      select: "Name email ID"
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const course = await Course.findOne({ requestId: id });

    const requestDetails = {
      ...request.toObject(),
      courseCreated: !!course,
      courseId: course ? course._id : null
    };

    res.status(200).json(requestDetails);
  } catch (err) {
    res.status(500).json({ message: "Error fetching request details", error: err.message });
  }
});


// Admin approves a course request
router.patch("/approve/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (user.Role !== "Admin") {
      return res.status(403).json({ message: "Only admins can approve course requests" });
    }

    const request = await CourseRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "Approved";
    await request.save();

    res.status(200).json({ message: "Course request approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error approving request", error: err.message });
  }
});

// Admin rejects a course request
router.patch("/reject/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (user.Role !== "Admin") {
      return res.status(403).json({ message: "Only admins can reject course requests" });
    }

    const request = await CourseRequest.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "Rejected";
    await request.save();

    res.status(200).json({ message: "Course request rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting request", error: err.message });
  }
});

// Admin deletes a rejected course request
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (user.Role !== "Admin") {
      return res.status(403).json({ message: "Only admins can delete course requests" });
    }

    const request = await CourseRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "Rejected") {
      return res.status(400).json({ message: "Only rejected course requests can be deleted" });
    }

    await CourseRequest.findByIdAndDelete(id);
    res.status(200).json({ message: "Rejected course request deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting request", error: err.message });
  }
});


// Manager views their own course requests
router.get("/my-requests", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.Role !== "Manager") {
      return res.status(403).json({ message: "Only managers can access this" });
    }

    const requests = await CourseRequest.find({ managerId: req.user.userId });

    const requestsWithStatus = await Promise.all(requests.map(async (request) => {
      const course = await Course.findOne({ requestId: request._id });
      return {
        ...request.toObject(),
        courseCreated: !!course,
        courseId: course ? course._id : null
      };
    }));

    res.status(200).json(requestsWithStatus);
  } catch (err) {
    res.status(500).json({ message: "Error fetching requests", error: err.message });
  }
});

module.exports = router;
