import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../Api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ManagerNavbar from "./ManagerNavbar";
import Swal from "sweetalert2";

const UpdateManagerProfile = () => {
  const [formData, setFormData] = useState({
    Name: "",
    Designation: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    id: "",
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
      await Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile has been updated successfully.",
        confirmButtonColor: "#0ea5e9",
        confirmButtonText: "OK",
      });

      navigate("/manager");
    } catch (error) {
      console.error("Failed to update profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#ef4444",
        confirmButtonText: "OK",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <ManagerNavbar />
      <div className="flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-[#1E255A] border border-sky-200 shadow-lg rounded-2xl p-8 w-full max-w-4xl"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-sky-700">
            Update Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-sky-700 mb-1">
                ID
              </label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                readOnly
              />
            </div>

            <div>
              <label htmlFor="Name" className="block text-sm font-medium text-sky-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="Name"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>

            <div>
              <label htmlFor="Designation" className="block text-sm font-medium text-sky-700 mb-1">
                Designation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="Designation"
                name="Designation"
                value={formData.Designation}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-sky-700 mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-sky-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-sky-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[35px] text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-sky-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[35px] text-white"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateManagerProfile;
