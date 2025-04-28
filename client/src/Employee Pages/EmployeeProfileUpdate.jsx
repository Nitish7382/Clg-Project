import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../Api"; // assuming you have these functions
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Eye icons
import Swal from "sweetalert2"; // <--- Import Swal here
import EmployeeNavbar from "./EmployeeNavbar";

const EmployeeProfileUpdate = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Designation: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    id: "", // Added ID field
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setFormData({
          Name: data.Name || "",
          Designation: data.Designation || "",
          username: data.username || "",
          email: data.email || "",
          password: "",
          confirmPassword: "",
          id: data.ID || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      await updateProfile(formData);
      // Success alert using Swal
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile has been successfully updated.",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate("/employee"); // Navigate after user clicks "OK"
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Error alert using Swal
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update profile. Please try again later.",
        confirmButtonColor: "#d33",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <EmployeeNavbar/>
      <div className="flex items-center justify-center mt-3">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 text-white shadow-md rounded-lg p-4 w-full max-w-sm"
        >
          <h2 className="text-xl font-semibold mb-4 text-center">Update Profile</h2>

          {/* ID Input */}
          <div className="mb-3">
            <label htmlFor="id" className="block text-gray-300 text-sm font-medium mb-1">
              ID
            </label>
            <div className="relative">
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-700 text-white opacity-70 cursor-not-allowed"
                readOnly
              />
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-3">
            <label htmlFor="Name" className="block text-gray-300 text-sm font-medium mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
              required
            />
          </div>

          {/* Designation Input */}
          <div className="mb-3">
            <label htmlFor="Designation" className="block text-gray-300 text-sm font-medium mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="Designation"
              name="Designation"
              value={formData.Designation}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
              required
            />
          </div>

          {/* Username Input */}
          <div className="mb-3">
            <label htmlFor="username" className="block text-gray-300 text-sm font-medium mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
              required
            />
          </div>

          {/* Email Input */}
          <div className="mb-3">
            <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-3 relative">
            <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="mb-3 relative">
            <label htmlFor="confirmPassword" className="block text-gray-300 text-sm font-medium mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-700 text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeProfileUpdate;
