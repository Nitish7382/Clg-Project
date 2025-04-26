import React, { useState } from "react";
import { registerUser } from "./Api";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StarsCanvas from "./Welcome Page/Bgwelcome";
import Navbar from "./Welcome Page/Navbar";
import { FaEye, FaEyeSlash } from "react-icons/fa";

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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      if (response.data?.message === "User registered successfully") {
        toast.success("Registered successfully!", { autoClose: 2000 });
        setTimeout(() => navigator("/signin"), 2000);
      } else {
        toast.error("Error: " + response.data?.message, { autoClose: 2000 });
      }
    } catch (error) {
      console.log("Error details:", error);
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      toast.error(errorMessage, { autoClose: 2000 });
    }
  };

  return (
    <div className="relative flex justify-center items-center h-screen">
      <Navbar />
      <div className="absolute inset-0 -z-10">
        <StarsCanvas />
      </div>
      <div className="relative bg-transparent border-2 border-white/20 backdrop-blur-lg p-6 rounded-lg shadow-lg w-[500px] mx-4 z-10 mt-11">
        <h2 className="text-center text-4xl font-medium text-green-500 mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="ID Number"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Full Name"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none col-span-2"
          />

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 pr-10 rounded-full border border-white bg-white/90 focus:outline-none w-full"
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-2 pr-10 rounded-full border border-white bg-white/90 focus:outline-none w-full"
            />
            <div
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none col-span-2"
          >
            <option value="">--Select Role--</option>
            <option value="Admin">ADMIN</option>
            <option value="Manager">MANAGER</option>
            <option value="Employee">EMPLOYEE</option>
          </select>

          {(role === "Manager" || role === "Admin") && (
            <input
              type="text"
              placeholder="Invite Token"
              value={inviteToken}
              onChange={(e) => setInviteToken(e.target.value)}
              className="px-4 py-2 rounded-full border border-white bg-white/90 focus:outline-none col-span-2"
            />
          )}

          <button
            type="submit"
            className="col-span-2 bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-white text-sm">
            Already have an account?{" "}
            <Link to="/signin" className="text-blue-400">
              Sign In
            </Link>
          </p>
        </div>

        {message && (
          <p className="mt-4 text-center text-white">
            {message}
          </p>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default SignUp;
