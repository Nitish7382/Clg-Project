const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
    const { ID, Name, email, Designation, username, password, Role, inviteCode } = req.body;
  
    const INVITE_CODE = process.env.INVITE_CODE; // move it here
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already exists" });
  
      if ((Role === "Admin" || Role === "Manager") && inviteCode !== INVITE_CODE) {
        return res.status(403).json({ message: "Invalid invitation code" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        ID, Name, email, Designation, username,
        password: hashedPassword, Role
      });
  
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } // Catching server errors in the backend
    catch (err) {
      console.error("Backend error:", err);  // Log the error to the console for debugging
    
      const errorMessage = err.message || "Server error";  // Extract the error message or use a default message
      res.status(500).json({ message: errorMessage, error: err.message });  // Send a clear error message to the frontend
    }
    
  });
  

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, role: user.Role }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({ token, user: { ID: user.ID, Name: user.Name, email: user.email, role: user.Role } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
