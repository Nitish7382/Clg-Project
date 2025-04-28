import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import { SiBookstack } from "react-icons/si";
import { FaUserCheck, FaUserCircle } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { getProfile } from "../Api";

const ManagerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [managerName, setManagerName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setManagerName(data.Name);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    setIsMobileMenuOpen(false); // Close mobile menu on logout
    navigate("/");
  };

  const handleCourseList = () => {
    navigate("/manager-course-list");
    setIsMobileMenuOpen(false);
  };

  const handleEmployeeProgress = () => {
    navigate("/employee-progresses");
    setIsMobileMenuOpen(false);
  };

  const handleUpdateProfile = () => {
    navigate("/update-profile");
    setIsMobileMenuOpen(false);
  };

  const isCourseListPage = location.pathname === "/manager-course-list";
  const isEmployeeProgressPage = location.pathname === "/employee-progresses";

  return (
    <div className="bg-gradient-to-r from-[#2A0E61] to-[#150d3f] text-white px-4 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <h1
          onClick={() => {
            navigate("/manager");
            setIsMobileMenuOpen(false);
          }}
          className="text-2xl md:text-3xl font-bold cursor-pointer"
        >
          Learning Hub
        </h1>

        {/* Hamburger Menu */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <HiX className="text-3xl" />
            ) : (
              <HiMenuAlt3 className="text-3xl" />
            )}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {!isCourseListPage && (
            <button
              onClick={handleCourseList}
              className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <SiBookstack className="text-xl" />
              <span>Course List</span>
            </button>
          )}
          {!isEmployeeProgressPage && (
            <button
              onClick={handleEmployeeProgress}
              className="flex items-center gap-2 bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <FaUserCheck className="text-xl" />
              <span>Employee Progress</span>
            </button>
          )}
          {/* Profile + Name */}
          <div className="flex items-center gap-2">
            <button onClick={handleUpdateProfile} className="text-3xl">
              <FaUserCircle className="cursor-pointer" />
            </button>
            <span className="text-lg hidden lg:inline-block">
              {managerName ? `Hey, ${managerName.split(" ")[0]}!` : "Hey, Manager!"}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <IoMdLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-3 bg-[#1d1445] p-4 rounded-lg shadow-lg">
          {!isCourseListPage && (
            <button
              onClick={handleCourseList}
              className="flex items-center gap-3 bg-blue-600 px-4 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <SiBookstack className="text-xl" />
              <span>Course List</span>
            </button>
          )}
          {!isEmployeeProgressPage && (
            <button
              onClick={handleEmployeeProgress}
              className="flex items-center gap-3 bg-indigo-600 px-4 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              <FaUserCheck className="text-xl" />
              <span>Employee Progress</span>
            </button>
          )}
          <button
            onClick={handleUpdateProfile}
            className="flex items-center gap-3 bg-green-600 px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            <FaUserCircle className="text-xl" />
            <span>Update Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 bg-red-600 px-4 py-3 rounded-lg hover:bg-red-700 transition"
          >
            <IoMdLogOut className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ManagerNavbar;
