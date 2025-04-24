"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  slideInFromLeft,
  slideInFromRight,
} from "../utils/motion";
import img from "../assets/images/mainIconsdark.svg";

const HeroContent = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-row items-center justify-center px-20 mt-20 w-full z-[20] overflow-hidden"
    >
      <div className="h-full w-full flex flex-col gap-5 justify-center m-auto text-start">
      
        <motion.div
          variants={slideInFromLeft(0.5)}
          className="flex flex-col gap-6 mt-2 text-6xl font-bold text-white max-w-[600px] w-auto h-auto"
        >
          <span>
            Welcome To
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
              {" "}
              Learning HUB{" "}
            </span>
            <span className=" font-semibold text-4xl">
              
            </span>
          </span>
        </motion.div>

        <motion.p
          variants={slideInFromLeft(0.8)}
          className="text-lg text-gray-400 my-5 max-w-[600px]"
        >
          Transform What You Know into What You Can Do - Building Skills for Tomorrow's Challenges
        </motion.p>
        
        <div className="flex gap-4">
  <motion.a
    href="/signup"
    variants={slideInFromLeft(1)}
    className="py-3 px-8 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-center font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-purple-600 hover:to-cyan-600 ml-4" // Added margin-left
  >
    Signup
  </motion.a>

  <motion.a
    href="/signin"
    variants={slideInFromLeft(1.2)}
    className="py-3 px-8 bg-gradient-to-r from-teal-500 to-blue-500 text-white text-center font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-teal-600 hover:to-blue-600 ml-4" // Added margin-left
  >
    Login
  </motion.a>
</div>
      </div>

      <motion.div
        variants={slideInFromRight(0.8)}
        className="w-full h-full flex justify-center items-center"
      >
        <img
          src={img}
          alt="work icons"
          height={600}
          width={600}
          className="object-contain"
        />
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
