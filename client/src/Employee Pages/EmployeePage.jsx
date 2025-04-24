import React, { useState, useEffect } from "react";
import Navbar from "./EmployeeNavbar";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import {
  getEmployeeCourse,
  updateCourseProgress,
  completeCourse,
  submitFeedback,
} from "../Api";

function EmployeePage() {
  const [activeTab, setActiveTab] = useState("learnings");
  const [courses, setCourses] = useState([]);
  const [progressInputs, setProgressInputs] = useState({});
  const [showRateModal, setShowRateModal] = useState(false);
  const [ratingCourseId, setRatingCourseId] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredStar, setHoveredStar] = useState(null);

  const navigator = useNavigate();

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  };

  useEffect(() => {
    const fetchEmployeeCourses = async () => {
      try {
        const response = await getEmployeeCourse();
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchEmployeeCourses();
  }, []);

  const handleSliderChange = (progressId, value) => {
    setProgressInputs((prev) => ({
      ...prev,
      [progressId]: value,
    }));
  };

  const handleSaveProgress = async (courseData) => {
    const { courseId, progress } = courseData;
    const value = parseInt(progressInputs[courseId._id] || progress);

    try {
      await updateCourseProgress(courseId._id, value);

      if (value === 100 && !courseData.isCompleted) {
        await completeCourse(courseId._id);
        Swal.fire("Success!", "Course marked as completed!", "success");
      } else {
        Swal.fire("Success!", "Progress updated successfully!", "success");
      }

      const response = await getEmployeeCourse();
      setCourses(response.data);
    } catch (error) {
      console.error("Error updating progress:", error);
      Swal.fire("Error!", "Failed to update progress", "error");
    }
  };

  const takeAssessment = (courseId) => {
    navigator("/takeassessment", {
      state: {
        courseId: courseId,
      },
    });
  };

  const openRateModal = (courseId) => {
    setRatingCourseId(courseId);
    setRating(0);
    setReview("");
    setShowRateModal(true);
  };

  const submitRating = async () => {
    if (rating === 0) {
      Swal.fire("Required!", "Please select a star rating.", "warning");
      return;
    }

    if (!review.trim()) {
      Swal.fire("Required!", "Please provide your feedback.", "warning");
      return;
    }

    try {
      await submitFeedback(ratingCourseId, { rating, review });
      Swal.fire("Success!", "Thanks for your feedback!", "success");

      const response = await getEmployeeCourse();
      setCourses(response.data);
      setShowRateModal(false);
    } catch (error) {
      console.error("Rating submission failed:", error);
      Swal.fire("Error!", "Could not submit rating.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#070012] text-white pb-10">
      <Navbar />

      {/* Tabs */}
      <div className="mt-6 h-12 w-full relative border border-white/30 bg-white/10 backdrop-blur-md shadow-lg rounded-3xl text-2xl flex items-center justify-between overflow-hidden">
        <div
          className={`absolute top-0 h-full w-1/2 rounded-3xl bg-[#bb74eb] transition-all duration-250 ${
            activeTab === "learnings" ? "left-0" : "left-1/2"
          }`}
        ></div>

        <div className="w-1/2 h-full flex items-center justify-center z-10">
          <button
            onClick={() => setActiveTab("learnings")}
            className="w-full h-full text-white"
          >
            My Learnings
          </button>
        </div>
        <div className="w-1/2 h-full flex items-center justify-center z-10">
          <button
            onClick={() => setActiveTab("assessments")}
            className="w-full h-full text-white"
          >
            My Assessments
          </button>
        </div>
      </div>

      {activeTab === "learnings" && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((courseData) => {
            const {
              courseId,
              progress,
              isCompleted,
              isCompletedAssessment,
              isRated,
            } = courseData; // Destructure all relevant values

            return (
              <div
                key={courseId._id}
                className="bg-white/10 p-5 rounded-2xl border border-white/20 shadow-lg hover:shadow-indigo-900"
              >
                <h3 className="text-xl font-semibold mb-2">{courseId.title}</h3>
                <iframe
                  className="w-full h-48 rounded-lg mb-4"
                  src={getYouTubeEmbedUrl(courseId.videoLink)}
                  title="Course Video"
                  allowFullScreen
                ></iframe>

                <a
                  href={`http://localhost:5000${courseId.pdfLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline inline-block mb-3"
                >
                  View PDF
                </a>

                {progress < 100 && (
                  <>
                    <label htmlFor="progress" className="block text-sm mb-1">
                      Select your progress:
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={progressInputs[courseId._id] || progress}
                      onChange={(e) =>
                        handleSliderChange(courseId._id, e.target.value)
                      }
                      className="w-full accent-[#bb74eb]"
                    />
                    <div className="flex justify-between text-sm mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center mt-3">
                  <span className="text-2xl text-green-400 font-bold">
                    {progressInputs[courseId._id] || progress}%
                  </span>

                  {progress === 100 ? (
                    isCompleted ? (
                      <button
                        disabled
                        className="py-2 px-4 bg-green-600 rounded-2xl cursor-not-allowed"
                      >
                        ✅ Completed
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSaveProgress(courseData)}
                        className="py-2 px-4 bg-blue-600 rounded-2xl hover:bg-blue-700"
                      >
                        Complete Course
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => handleSaveProgress(courseData)}
                      className="py-2 px-4 bg-[#bb74eb] rounded-2xl hover:bg-[#a95ce0]"
                    >
                      Update Progress
                    </button>
                  )}
                </div>

                {progress === 100 && isCompleted && (
                  <>
                    {!isCompletedAssessment ? (
                      <button
                        onClick={() => takeAssessment(courseId._id)}
                        className="mt-3 w-full py-2 px-4 bg-purple-600 rounded-2xl hover:bg-purple-700"
                      >
                        Take Assessment
                      </button>
                    ) : !isRated ? (
                      <button
                        onClick={() => openRateModal(courseId._id)}
                        className="mt-3 w-full py-2 px-4 bg-yellow-500 rounded-2xl hover:bg-yellow-600"
                      >
                        ⭐ Rate Course
                      </button>
                    ) : null}
                  </>
                )}

                {progress > 0 && (
                  <p className="mt-2 text-sm text-white">
                    You've watched {progressInputs[courseId._id] || progress}%
                    of this course.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Assessments */}
      {activeTab === "assessments" && (
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold mb-6">📚 Assessments Section</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6">
            {courses
              .filter((courseData) => courseData.isCompletedAssessment)
              .map((courseData, index) => {
                const { courseId } = courseData;
                return (
                  <div
                    key={courseId._id}
                    className="bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-lg shadow-lg hover:shadow-indigo-900"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      Assessment {index + 1}
                    </h3>
                    <p className="text-sm mb-4">{courseId.title}</p>
                    <p className="text-green-400 font-bold">✅ Completed</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Rate Course Modal */}
      {showRateModal && (
        <div className="fixed inset-0 bg-white/20 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Rate this Course</h2>

            <label className="block mb-2 font-semibold">
              Rating: <span className="text-red-700">*</span>
            </label>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <Star
                  key={starValue}
                  size={28}
                  className={`cursor-pointer transition-colors ${
                    (hoveredStar || rating) >= starValue
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoveredStar(starValue)}
                  onMouseLeave={() => setHoveredStar(null)}
                />
              ))}
            </div>

            <label className="block mb-2 font-semibold">
              Feedback: <span className="text-red-700">*</span>
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              rows="4"
            />

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowRateModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeePage;
