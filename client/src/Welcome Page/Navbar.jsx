import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ onScrollToServices, onScrollToAbout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("home"); // Default is 'home'

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setActiveTab("home"); // Set 'home' as active when clicking the Home button
  };

  // Check if the current path is "/"
  const isHomePage = location.pathname === "/";

  return (
    <div className="w-full h-[70px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#030014cc] backdrop-blur-md z-50 px-6 md:px-10">
      <div
        className="w-full h-full flex items-center justify-between"
        onClick={() => navigate("/")}
      >
        {/* Logo / Title */}
        <div className="cursor-pointer" onClick={scrollToTop}>
          <span className="font-bold text-2xl text-white">Learning Hub</span>
        </div>

        {/* Conditionally render Nav Tabs based on current path */}
        {isHomePage && (
          <div className="flex gap-6">
            <button
              onClick={() => {
                scrollToTop();
                setActiveTab("home"); // Set 'home' as active when Home is clicked
              }}
              className="relative text-white text-sm md:text-base font-medium py-2 px-1 transition duration-300 hover:text-white"
            >
              Home
              {/* Active Bottom Bar */}
              {activeTab === "home" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full transition-all duration-300" />
              )}
            </button>

            <button
              onClick={() => {
                onScrollToServices();
                setActiveTab("services"); // Set 'services' as active when Services is clicked
              }}
              className="relative text-white text-sm md:text-base font-medium py-2 px-1 transition duration-300 hover:text-white"
            >
              Services
              {/* Active Bottom Bar */}
              {activeTab === "services" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full transition-all duration-300" />
              )}
            </button>

            <button
              onClick={() => {
                onScrollToAbout();
                setActiveTab("about"); // Set 'about' as active when About is clicked
              }}
              className="relative text-white text-sm md:text-base font-medium py-2 px-1 transition duration-300 hover:text-white"
            >
              About
              {/* Active Bottom Bar */}
              {activeTab === "about" && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white rounded-full transition-all duration-300" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
