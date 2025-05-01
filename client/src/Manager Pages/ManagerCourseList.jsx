import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManagerNavbar from "./ManagerNavbar";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { getManagerAllCourses, getCourseRatings } from "../Api";
import AssignEmployeeModal from "./AssignEmployeeModal";
import ReviewModal from "./ManagerReviewModal";

const ManagerCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [courseRatings, setCourseRatings] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedReviewRatings, setSelectedReviewRatings] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getManagerAllCourses();
        setCourses(data);

        const ratingsData = await Promise.all(
          data.map(async (course) => {
            const ratings = await getCourseRatings(course._id);
            return {
              courseId: course._id,
              averageRating: ratings.averageRating,
              totalRatings: ratings.totalRatings,
              ratings: ratings.ratings,
            };
          })
        );

        const ratingsMap = ratingsData.reduce((acc, rating) => {
          acc[rating.courseId] = rating;
          return acc;
        }, {});

        setCourseRatings(ratingsMap);
      } catch (error) {
        console.error("Error fetching courses or ratings:", error);
      }
    };

    fetchCourses();
  }, []);

  const openReviewModal = (courseId) => {
    const courseRating = courseRatings[courseId];
    if (courseRating) {
      setSelectedReviewRatings(courseRating.ratings);
      setIsReviewModalOpen(true);
    }
  };

  const getEmbedUrl = (url) => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const openModal = (courseId) => {
    setSelectedCourseId(courseId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCourseId(null);
    setModalOpen(false);
  };

  return (
    <div className="bg-[#0B0F2A] min-h-screen text-white">
      <ManagerNavbar />
      <div className="text-blue-300 text-3xl font-bold py-4 px-6">
       Manager Course List
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6 pb-10">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-[#1E255A] p-5 rounded-xl shadow-xl border border-blue-500"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-semibold text-blue-200 mb-2">
                {course.title}
              </h4>

              {courseRatings[course._id] &&
                (() => {
                  const rating = courseRatings[course._id].averageRating;
                  return (
                    <div className="flex items-center text-yellow-400 gap-1 mb-2">
                      {Array.from({ length: 5 }, (_, index) => {
                        if (rating >= index + 1) return <FaStar key={index} />;
                        else if (rating >= index + 0.3)
                          return <FaStarHalfAlt key={index} />;
                        else return <FaRegStar key={index} />;
                      })}
                      <span
                        className="text-blue-300 text-sm ml-1 underline cursor-pointer"
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

            <p className="text-blue-100 mb-1">
              <span className="font-semibold text-blue-300">Concept:</span>{" "}
              {course.concept}
            </p>
            <p className="text-blue-100 mb-1">
              <span className="font-semibold text-blue-300">Duration:</span>{" "}
              {course.duration}
            </p>
            <p className="text-blue-100 mb-1">
              <span className="font-semibold text-blue-300">Description:</span>{" "}
              {course.description}
            </p>
            <p className="text-blue-100 mb-3">
              <span className="font-semibold text-blue-300">Last Updated:</span>{" "}
              {new Date(course.updatedAt).toLocaleString()}
            </p>

            {getEmbedUrl(course.videoLink) && (
              <div className="mb-3">
                <iframe
                  width="100%"
                  height="180"
                  src={getEmbedUrl(course.videoLink)}
                  title="Course Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-md"
                ></iframe>
              </div>
            )}

            <a
              href={`http://localhost:5000${course.pdfLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline inline-block mb-4"
            >
            View PDF
            </a>

            <div className="flex gap-3">
              <button
                onClick={() => openModal(course._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md w-full"
              >
                Assign Employee
              </button>

              <button
                onClick={() =>
                  navigate("/View-assessments", {
                    state: { courseId: course._id },
                  })
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md w-full"
              >
                View Assessments
              </button>
            </div>
          </div>
        ))}
      </div>

      <AssignEmployeeModal
        isOpen={modalOpen}
        onClose={closeModal}
        courseId={selectedCourseId}
      />

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        ratings={selectedReviewRatings}
      />
    </div>
  );
};

export default ManagerCourseList;
