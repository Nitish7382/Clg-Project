import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllCourses,
  uploadPDF,
  editCourse,
  getAdminCourseRatings,
} from "../Api";
import Navbar from "./AdminNavbar";
import AdminReviewModal from "./AdminReviewModal";
import {
  FaEdit,
  FaPenFancy,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";

const CourseList = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [courseRatings, setCourseRatings] = useState({});
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewRatings, setSelectedReviewRatings] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchCoursesAndRatings = async () => {
      try {
        const courses = await getAllCourses();
        setAllCourses(courses);

        const ratingsMap = {};

        for (const course of courses) {
          try {
            const rating = await getAdminCourseRatings(course._id);
            ratingsMap[course._id] = rating;
          } catch (ratingError) {
            console.error(
              `Failed to fetch rating for course ${course._id}`,
              ratingError
            );
            ratingsMap[course._id] = null; // fallback if no rating found
          }
        }

        setCourseRatings(ratingsMap);
      } catch (error) {
        console.error("Error fetching courses or ratings:", error);
      }
    };

    fetchCoursesAndRatings();
  }, []);

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setEditFormData({
      title: course.title || "",
      description: course.description || "",
      concept: course.concept || "",
      duration: course.duration || "",
      videoLink: course.videoLink || "",
      pdfFile: null,
      pdfLink: course.pdfLink || "",
    });
  };

  const openReviewModal = (courseId) => {
    const courseRating = courseRatings[courseId];
    if (courseRating) {
      setSelectedReviewRatings(courseRating.ratings);
      setIsReviewModalOpen(true);
    }
  };

  const extractYouTubeId = (url) => {
    try {
      const youtubeUrl = new URL(url);
      if (youtubeUrl.hostname === "youtu.be") {
        return youtubeUrl.pathname.slice(1);
      } else if (youtubeUrl.hostname.includes("youtube.com")) {
        return youtubeUrl.searchParams.get("v");
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setEditFormData((prev) => ({ ...prev, pdfFile: e.target.files[0] }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      let pdfLink = editFormData.pdfLink;
      if (editFormData.pdfFile) {
        pdfLink = await uploadPDF(editFormData.pdfFile);
      }

      const payload = {
        title: editFormData.title,
        description: editFormData.description,
        concept: editFormData.concept,
        duration: editFormData.duration,
        videoLink: editFormData.videoLink,
        pdfLink,
      };

      const courseId = selectedCourse._id;
      const response = await editCourse(courseId, payload);

      if (response.status === 200) {
        Swal.fire("Success!", "Course Updated Successfully", "success");
        setSelectedCourse(null);
        setEditFormData(null);
        const updatedCourses = await getAllCourses();
        setAllCourses(updatedCourses);
      } else {
        Swal.fire("Error", "Something went wrong!", "error");
      }
    } catch (error) {
      console.error("Edit failed:", error);
      Swal.fire(
        "Error",
        error.response?.data?.message || "Update failed",
        "error"
      );
    }
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setEditFormData(null);
  };

  const handleCreateOrEditAssessment = (course) => {
    navigate(
      !course.hasAssessment ? "/createassessment" : `/updateassessment`,
      {
        state: { courseId: course._id },
      }
    );
  };

  const renderStars = (average) => {
    const rounded = Math.round(average);
    return "★".repeat(rounded) + "☆".repeat(5 - rounded);
  };

  return (
    <div className="min-h-screen bg-[#060220]">
      <Navbar />
      <h3 className="text-3xl font-semibold text-white mb-4 px-4">
        Course Lists
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {allCourses.map((course, index) => {
          const videoId = extractYouTubeId(course.videoLink);
          const ratingData = courseRatings[course._id];
          return (
            <div
              key={index}
              className="p-4 bg-white/20 backdrop-blur-sm bg-opacity-60 rounded-md shadow-md transition-transform transform hover:-translate-y-1 hover:backdrop-blur-3xl hover:bg-white/30 hover:shadow-xl cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-green-500 mb-1">
                  {course.title}
                </h4>

                {courseRatings[course._id] &&
                  (() => {
                    const rating = courseRatings[course._id].averageRating;

                    return (
                      <div className="flex items-center text-yellow-400 gap-1 mb-2">
                        {Array.from({ length: 5 }, (_, index) => {
                          if (rating >= index + 1) {
                            return <FaStar key={index} />;
                          } else if (rating >= index + 0.5) {
                            return <FaStarHalfAlt key={index} />;
                          } else {
                            return <FaRegStar key={index} />;
                          }
                        })}
                        <span
                          className="text-white text-sm ml-1 underline cursor-pointer"
                          onClick={() => openReviewModal(course._id)}
                        >
                          {rating.toFixed(1)} (
                          {courseRatings[course._id].totalRatings}{" "}
                          {courseRatings[course._id].totalRatings === 1
                            ? "review"
                            : "reviews"}
                          )
                        </span>
                      </div>
                    );
                  })()}
              </div>
              <p className="text-white">
                <span className="font-semibold">Concept : </span>{" "}
                {course.concept}
              </p>
              <p className="text-white">
                <span className="font-semibold text-yellow-500">
                  Duration :{" "}
                </span>
                {course.duration}
              </p>

              {videoId && (
                <div className="mt-4 aspect-w-16 aspect-h-9">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title={`Video for ${course.title}`}
                    allowFullScreen
                    frameBorder="0"
                    className="w-full h-52 rounded-md"
                  ></iframe>
                </div>
              )}

              {course.pdfLink && (
                <div className="mt-4">
                  <a
                    href={`http://localhost:5000${course.pdfLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white underline text-sm mt-2 inline-block"
                  >
                    View Full PDF
                  </a>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => openEditModal(course)}
                  className="px-4 py-2 max-h-10 w-24 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={() => handleCreateOrEditAssessment(course)}
                  className={`px-4 py-2 max-h-10 rounded-md transition-colors flex items-center justify-center ${
                    course.hasAssessment
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  <FaPenFancy className="mr-2" />
                  {course.hasAssessment
                    ? "Edit Assessment"
                    : "Create Assessment"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editFormData && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/20 backdrop-blur-md bg-opacity-50 z-50">
          <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-2xl relative">
            <button
              className="absolute top-2 right-3 text-gray-500 hover:text-red-700 text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Course</h2>

            <form onSubmit={handleEditSubmit}>
              {["title", "description", "concept", "duration", "videoLink"].map(
                (field) => (
                  <div key={field} className="mb-3">
                    <input
                      type="text"
                      name={field}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editFormData[field]}
                      onChange={handleEditChange}
                    />
                  </div>
                )
              )}

              <div className="mb-3">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              {editFormData.pdfLink && (
                <div className="mb-4">
                  <a
                    href={`http://localhost:5000${editFormData.pdfLink}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm mt-2 inline-block"
                  >
                    View Full PDF
                  </a>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
      <AdminReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        ratings={selectedReviewRatings}
      />
    </div>
  );
};

export default CourseList;
