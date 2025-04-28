import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi"; 
import { getProfile } from "../Api";

const EmployeeNavbar = () => {
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setEmployeeName(data.Name); 
      } catch (error) {
        console.error("Failed to fetch employee profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const handleDashboard = () => {
    navigate("/employee");
    setIsMobileMenuOpen(false);
  };

  const handleUpdateProfile = () => {
    navigate("/update-employee-profile");
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-[#17054f] text-white shadow-lg">
      <div className="flex items-center justify-between py-3 px-4 md:px-8">
        {/* Logo Section */}
        <div
          onClick={handleDashboard}
          className="flex items-center space-x-3 cursor-pointer"
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
            Learning Hub
          </h1>
        </div>

        {/* Hamburger - Mobile */}
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
        <div className="hidden md:flex items-center space-x-8">
          {/* Profile + Name */}
          <div className="flex items-center gap-3">
            <button onClick={handleUpdateProfile} className="text-3xl">
              <FaUserCircle className="cursor-pointer" />
            </button>
            <span className="text-lg">
              {employeeName ? `Hey, ${employeeName.split(" ")[0]}!` : "Hey, Employee!"}
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 bg-[#1d1445] p-4 rounded-b-lg shadow-md">
          <button
            onClick={handleDashboard}
            className="flex items-center gap-3 bg-purple-600 px-4 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            <FaUserCircle className="text-xl" />
            <span>Dashboard</span>
          </button>

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
            <FaSignOutAlt className="text-xl" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default EmployeeNavbar;
