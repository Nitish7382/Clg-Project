const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  ID: { type: String, required: true },
  Name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  Designation: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  Role: { type: String, enum: ["Admin", "Manager", "Employee"], required: true },
});

module.exports = mongoose.model("User", userSchema);
