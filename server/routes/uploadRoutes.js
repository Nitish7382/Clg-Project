const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs")
const { handleUpload } = require("../middlewares/uploadMiddleware")
const authMiddleware = require("../middlewares/authMiddleware")
const User = require("../models/User")

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "..", "uploads", "pdfs")
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Upload PDF file
router.post("/pdf", authMiddleware, handleUpload("pdf"), async (req, res) => {
  try {
    // Check if user is admin or manager
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Admin" && user.Role !== "Manager") {
      return res.status(403).json({ message: "Only admins and managers can upload files" })
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded or file is not a PDF" })
    }

    // Create the file URL path
    const fileUrl = `/uploads/pdfs/${req.file.filename}`

    res.status(200).json({
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl,
      },
    })
  } catch (err) {
    console.error("Error uploading file:", err)
    res.status(500).json({ message: "Error uploading file", error: err.message })
  }
})

// Get all uploaded PDFs
router.get("/pdfs", authMiddleware, async (req, res) => {
  try {
    // Check if user is admin or manager
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Admin" && user.Role !== "Manager") {
      return res.status(403).json({ message: "Only admins and managers can view uploaded files" })
    }

    // Read the directory
    fs.readdir(uploadDir, (err, files) => {
      if (err) {
        return res.status(500).json({ message: "Error reading files directory", error: err.message })
      }

      // Filter for PDF files
      const pdfFiles = files.filter((file) => path.extname(file).toLowerCase() === ".pdf")

      // Create file objects with URLs
      const fileList = pdfFiles.map((file) => ({
        filename: file,
        url: `/uploads/pdfs/${file}`,
      }))

      res.status(200).json({
        message: "Files retrieved successfully",
        files: fileList,
      })
    })
  } catch (err) {
    res.status(500).json({ message: "Error retrieving files", error: err.message })
  }
})

// Delete a PDF file
router.delete("/pdf/:filename", authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.userId)
    if (user.Role !== "Admin") {
      return res.status(403).json({ message: "Only admins can delete files" })
    }

    const filename = req.params.filename
    const filePath = path.join(uploadDir, filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" })
    }

    // Delete the file
    fs.unlinkSync(filePath)

    res.status(200).json({ message: "File deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Error deleting file", error: err.message })
  }
})

module.exports = router
