import React from "react";
import logo from "../assets/images/NavLogo.png"; // Replace with the correct path to your logo
// Replace with your social icons path

const Navbar = () => {
  return (
    <div className="w-full h-[70px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-50 px-10">
      <div className="w-full h-full flex flex-row items-center justify-center m-auto px-[10px]">
        <a className="h-auto w-auto flex flex-row items-center">
          <img
            src={logo}
            alt="logo"
            width={70}
            height={70}
            className="cursor-pointer animate-spin"
          />

          <span className="font-bold ml-[10px] hidden md:block text-gray-300 text-3xl">
            Learning Hub
          </span>
        </a>
      </div>
    </div>
  );
};

export default Navbar;
