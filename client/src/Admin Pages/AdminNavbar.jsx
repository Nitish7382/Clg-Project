import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaChalkboardTeacher,
  FaUserTie,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi"; // Mobile menu icons
import { getProfile } from "../Api"; // Make sure you import it!

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setAdminName(data.Name); // assuming the API returns { Name: "Admin Name" }
      } catch (error) {
        console.error("Failed to fetch admin profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleCourseList = () => {
    navigate("/courselist");
    setIsMobileMenuOpen(false);
  };

  const handleCourseStats = () => {
    navigate("/coursestats");
    setIsMobileMenuOpen(false);
  };

  const handleDashboard = () => {
    navigate("/admin");
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleUpdateProfile = () => {
    navigate("/update-admin-profile");
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-[#2A0E61] to-[#150d3f] text-white py-4 px-4 md:px-8 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={handleDashboard}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            Learning Hub
          </h1>
        </div>

        {/* Hamburger menu - mobile */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <HiX className="text-3xl" />
            ) : (
              <HiMenuAlt3 className="text-3xl" />
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            onClick={handleCourseList}
          >
            <FaChalkboardTeacher /> Course List
          </button>

          <button
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={handleCourseStats}
          >
            <FaUserTie /> Course Stats
          </button>


          <div className="flex items-center gap-2">
          <button onClick={handleUpdateProfile} className="text-3xl">
            <FaUserCircle className="cursor-pointer" />
          </button>
          <span className="hidden lg:inline-block text-gray-300 text-lg">
            {adminName ? `Hey, ${adminName.split(" ")[0]}!` : "Hey, Admin!"}
          </span>
          </div>

          <button
            className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 bg-[#1d1445] p-4 rounded-lg shadow-lg">
          <button
            onClick={handleCourseList}
            className="flex items-center gap-3 bg-purple-600 px-4 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            <FaChalkboardTeacher className="text-xl" />
            <span>Course List</span>
          </button>

          <button
            onClick={handleCourseStats}
            className="flex items-center gap-3 bg-blue-600 px-4 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <FaUserTie className="text-xl" />
            <span>Course Stats</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-600 px-4 py-3 rounded-lg hover:bg-red-700 transition"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default AdminNavbar;
