import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../App.css";
import {
  FaChalkboardTeacher,
  FaUserTie,
  FaSignOutAlt
} from "react-icons/fa"; // Import icons

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route

  const handleCourseList = () => navigate("/courselist");
  const handleCourseStats = () => navigate("/coursestats"); // Navigate to Course Stats page
  const handleDashboard = () => navigate("/admin"); // Back to Dashboard handler
  const handleLogout = () => navigate("/");

  return (
    <header className="bg-gradient-to-r from-[#2A0E61] to-[#150d3f] text-white py-4 px-8 shadow-lg flex items-center">
      {/* Left Section: Logo and Title */}
      <div onClick={handleDashboard} className="flex items-center space-x-3">
        <h1
          className="text-3xl font-bold tracking-wide text-white cursor-pointer"
        >
          Learning Hub
        </h1>
      </div>

      {/* Center Section: Navigation Links */}
      <nav className="flex-1 flex justify-center space-x-6">
        {/* Add other links if necessary */}
      </nav>

      {/* Right Section: User Greeting & Logout */}
      <div className="flex items-center space-x-4">
        <button
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          onClick={handleCourseList}
        >
          <FaChalkboardTeacher /> Course List
        </button>

        {/* New Course Stats Button */}
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={handleCourseStats}
        >
          <FaUserTie /> Course Stats
        </button>

        <span className="hidden lg:inline-block text-gray-300 text-lg">
          Hey, <span className="font-bold text-white">Admin!</span>
        </span>

        <button
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
