import React from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/images/anime1.jpg";
import { FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    navigate("/"); // Redirect to login page after logout
  };

  return (
    <header className="bg-[#17054f] h-18 text-white p-2 flex items-center justify-between shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center space-x-4">
        <h1 className="text-3xl font-bold text-white">Learning Hub</h1>
      </div>

      {/* User Greeting and Logout */}
      <div className="flex items-center space-x-6">
        <span className="text-lg">Hey, Employee!</span>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          <FaSignOutAlt className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
