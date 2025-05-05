import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createCourse, uploadPDF, getRequestById } from "../Api";
import AdminNavbar from "./AdminNavbar";

function CreateCourse() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    concept: "",
    duration: "",
    videoLink: "",
    pdfFile: null,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { requestId } = location.state || {};

  useEffect(() => {
    const fetchRequestData = async () => {
      if (requestId) {
        try {
          const requestData = await getRequestById(requestId);
          setFormData((prev) => ({
            ...prev,
            title: requestData.title || "",
            description: requestData.description || "",
            concept: requestData.concept || "",
            duration: requestData.duration || "",
            videoLink: requestData.videoLink || "",
          }));
        } catch (error) {
          Swal.fire("Error", "Failed to load request data", "error");
        }
      }
    };

    fetchRequestData();
  }, [requestId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, pdfFile: e.target.files[0] }));
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      concept: "",
      duration: "",
      videoLink: "",
      pdfFile: null,
    });

    document.getElementById("pdfFileInput").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let pdfLink = "";
      if (formData.pdfFile) {
        pdfLink = await uploadPDF(formData.pdfFile);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        concept: formData.concept,
        duration: formData.duration,
        videoLink: formData.videoLink,
        pdfLink,
      };

      const response = await createCourse(requestId, payload);

      if (response.data.message === "Course created successfully") {
        Swal.fire("Success!", "Course Created Successfully!", "success");
        navigate("/courselist");
      } else {
        Swal.fire("Error!", "Failed to create requested Course", "error");
        navigate("/admin");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Request creation failed",
        "error"
      );
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-gray-800 shadow-lg rounded-xl p-6 w-full max-w-xl">
          <h2 className="text-center text-2xl font-semibold mb-6">
            Create New Course
          </h2>
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-4"
          >
            {[
              { label: "Title", name: "title" },
              { label: "Description", name: "description" },
              { label: "Concept", name: "concept" },
              { label: "Duration", name: "duration" },
              { label: "Video Link", name: "videoLink" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  className="w-full border border-gray-600 bg-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-1">
                PDF File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="pdfFile"
                id="pdfFileInput"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full border border-gray-600 bg-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-gray-600 text-white py-2 text-sm rounded-md hover:bg-gray-500 transition"
              >
                Reset
              </button>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 text-sm rounded-md hover:bg-blue-700 transition"
              >
                Create Course
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateCourse;
