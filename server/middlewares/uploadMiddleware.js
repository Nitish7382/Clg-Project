const multer = require("multer")
const fs = require("fs")
const path = require("path")

// Ensure the 'pdfs' folder exists
const uploadPath = path.join(__dirname, "..", "uploads", "pdfs")
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true })
}

// Set storage engine for multer to store files locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath) // Store the PDFs in the 'pdfs' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`) // Naming the file based on timestamp
  },
})

// Initialize multer with file filter to accept only PDFs
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true)
    } else {
      cb(new Error("Only PDF files are allowed"), false)
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
})

// Create a middleware that handles multer errors
const handleUpload = (fieldName) => {
  return (req, res, next) => {
    const uploadSingle = upload.single(fieldName)

    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File too large",
            error: "File size must be less than 10MB",
          })
        }
        if (err.code === "UNEXPECTED_FIELD") {
          // If the field name doesn't match, try to process the request without file upload
          console.log(`Warning: Expected file field "${fieldName}" but received a different field name`)
          return next()
        }
        return res.status(400).json({ message: "File upload error", error: err.message })
      } else if (err) {
        // An unknown error occurred
        return res.status(400).json({ message: "File upload error", error: err.message })
      }

      // Everything went fine
      next()
    })
  }
}

module.exports = {
  upload,
  handleUpload,
}
