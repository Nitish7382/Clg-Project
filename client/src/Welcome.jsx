import React from "react";
import "./index.css";
import { Link } from "react-router-dom";
import Right from "./assets/Right.json";
import img from "../src/assets/images/anime1.jpg";
import Lottie from "lottie-react";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import "./App.css";

function Welcome() {
  const [text] = useTypewriter({
    words: ["Learning Hub", "Learning Hub"], // List of phrases
    loop: true, // Set to true for infinite loop
    typeSpeed: 120, // Typing speed
    deleteSpeed: 100, // Deleting speed
  });

  return (
    <div className="min-h-screen bg-gray-50" id="background">
      {/* Navbar */}
      <header className="flex justify-center items-center px-4 py-4 md:px-8">
        <span className="text-3xl md:text-5xl font-bold text-orange-600">
          Learning Hub
        </span>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center px-4 md:px-8 py-8 md:py-16">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6">
            Enrich Your Skills with <br />
            <span className="text-orange-600">{text}</span>
            <Cursor cursorStyle="<" />
          </h1>
          <p className="text-gray-600 mb-4 md:mb-6 text-lg md:text-xl">
            Streamline training management and boost employee development 🚀
          </p>
          <div className="space-x-4">
            <Link to={"/signin"}>
              <button className="px-4 md:px-6 py-2 md:py-3 font-bold text-blue-500 border border-blue-500 rounded-full hover:bg-gray-100">
                Sign in
              </button>
            </Link>
            <Link to={"/signup"}>
              <button className="px-4 md:px-6 py-2 md:py-3 font-bold bg-blue-500 text-white rounded-full hover:bg-blue-700">
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* Illustration and Image Group */}
        <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center relative" id="icon">
          <div className="relative">
            {/* Animation */}
            <Lottie loop={true} animationData={Right} className="h-48 md:h-96" />
            {/* Image */}
            <img
              className="absolute bottom-32 right-0 w-16 md:w-24 lg:w-32"
              src={img}
              alt="Illustration"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Welcome;
