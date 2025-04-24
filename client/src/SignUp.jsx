import React, { useState } from "react";
import { registerUser } from "./Api";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StarsCanvas from "./Welcome Page/Bgwelcome";
import { motion } from "framer-motion";
import { slideInFromTop } from "./utils/motion";
import Navbar from "./Welcome Page/Navwelcome";

function SignUp() {
  const [accountId, setAccountId] = useState("");
  const [accountName, setAccountName] = useState("");
  const [designation, setDesignation] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [message, setMessage] = useState("");

  const navigator = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { autoClose: 2000 });
      return;
    }
  
    try {
      const payload = {
        ID: accountId,
        Name: accountName,
        Designation: designation,
        username,
        email,
        password,
        Role: role,
      };
  
      if (role === "Manager" || role === "Admin") {
        payload.inviteCode = inviteToken;
      }
  
      const response = await registerUser(payload);
  
      // Check if the response contains a success message
      if (response.data?.message === "User registered successfully") {
        toast.success("Registered successfully!", { autoClose: 2000 });  // Correct success message
        setTimeout(() => navigator("/signin"), 2000);  // Redirect to sign-in after a short delay
      } else {
        toast.error("Error: " + response.data?.message, { autoClose: 2000 });  // If not success, show error
      }
    } catch (error) {
      console.log("Error details:", error);  // Log the full error for inspection
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      toast.error(errorMessage, { autoClose: 2000 });  // Show the error message if something goes wrong
    }
  };
  
  
  
  return (
    <div className="relative flex justify-center items-center h-screen">
      <Navbar />
      <div className="absolute inset-0 -z-10">
        <StarsCanvas />
      </div>
      <motion.div
        className="relative bg-transparent border-2 border-white/20 backdrop-blur-lg p-6 rounded-lg shadow-lg w-[400px] mx-4 z-10 mt-11"
        initial="hidden"
        animate="visible"
        variants={slideInFromTop}
      >
        <motion.h2
          className="text-center text-4xl font-medium text-green-500 mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Sign Up
        </motion.h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <motion.input
            type="text"
            placeholder="Account ID"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          />
          <motion.input
            type="text"
            placeholder="Account Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          />
          <motion.input
            type="text"
            placeholder="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          />
          <motion.input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          />
          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          />
          <motion.input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          />
          <motion.select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <option value="">--Select Role--</option>
            <option value="Admin">ADMIN</option>
            <option value="Manager">MANAGER</option>
            <option value="Employee">EMPLOYEE</option>
          </motion.select>

          {(role === "Manager" || role === "Admin") && (
            <motion.input
              type="text"
              placeholder="Invite Token"
              value={inviteToken}
              onChange={(e) => setInviteToken(e.target.value)}
              className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            />
          )}

          <motion.button
            type="submit"
            className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Sign Up
          </motion.button>
        </form>

        <div className="mt-4 text-center">
          <motion.p
            className="text-white text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-400">
              Sign In
            </Link>
          </motion.p>
        </div>

        <motion.p
          className="mt-4 text-center text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          {message && <span>{message}</span>}
        </motion.p>
      </motion.div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default SignUp;
