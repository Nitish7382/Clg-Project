const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware"); // <-- import your middleware

// Register
router.post("/register", async (req, res) => {
  const { ID, Name, email, Designation, username, password, Role, inviteCode } = req.body;

  const INVITE_CODE = process.env.INVITE_CODE;

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
  } catch (err) {
    console.error("Backend error:", err);
    const errorMessage = err.message || "Server error";
    res.status(500).json({ message: errorMessage, error: err.message });
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

// GET profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// UPDATE profile
router.put("/update-profile", authMiddleware, async (req, res) => {
  const { Name, Designation, username, email, password } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (Name) user.Name = Name;
    if (Designation) user.Designation = Designation;
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        ID: user.ID,
        Name: user.Name,
        email: user.email,
        role: user.Role
      }
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
