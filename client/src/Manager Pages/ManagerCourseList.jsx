import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ManagerNavbar from "./ManagerNavbar";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { getManagerAllCourses, getCourseRatings } from "../Api";
import AssignEmployeeModal from "./AssignEmployeeModal"; // Import the modal
import ReviewModal from "./ManagerReviewModal";

const ManagerCourseList = () => {
  const [courses, setCourses] = useState([]);
  const [courseRatings, setCourseRatings] = useState({}); // State to store ratings for each course
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [selectedReviewRatings, setSelectedReviewRatings] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch courses and ratings
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getManagerAllCourses();
        setCourses(data);

        // Fetch ratings for each course
        const ratingsPromises = data.map(async (course) => {
          const ratingsData = await getCourseRatings(course._id);
          return {
            courseId: course._id,
            averageRating: ratingsData.averageRating,
            totalRatings: ratingsData.totalRatings,
          };
        });

        const ratingsData = await Promise.all(
          data.map(async (course) => {
            const ratings = await getCourseRatings(course._id);
            return {
              courseId: course._id,
              averageRating: ratings.averageRating,
              totalRatings: ratings.totalRatings,
              ratings: ratings.ratings, // include full ratings
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
    <div className="bg-gray-900 min-h-screen">
      <ManagerNavbar />
      <div className="text-white text-xl font-semibold py-2 px-4">
        Course List
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
          {courses.map((course) => (
            <div
              key={course._id}
              className="card text-sm p-4 bg-gray-500 rounded-lg backdrop-blur-2xl shadow-md"
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
                          } else if (rating >= index + 0.3) {
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
              <p className="text-white mb-1">
                <span className="font-semibold">Concept:</span> {course.concept}
              </p>
              <p className="text-white mb-1">
                <span className="font-semibold">Duration:</span>{" "}
                {course.duration}
              </p>
              <p className="text-white mb-1">
                <span className="font-semibold">Description:</span>{" "}
                {course.description}
              </p>
              <p className="text-white mb-2">
                <span className="font-semibold">Last Updated:</span>{" "}
                {new Date(course.updatedAt).toLocaleString()}
              </p>

              {/* Display Average Rating and Total Ratings */}

              {getEmbedUrl(course.videoLink) && (
                <div className="mb-2">
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
                className="text-blue-400 underline inline-block mb-3"
              >
                View PDF
              </a>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => openModal(course._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition w-full"
                >
                  Assign Employee
                </button>

                <button
                  onClick={() =>
                    navigate("/View-assessments", {
                      state: { courseId: course._id },
                    })
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition w-full"
                >
                  View Assessments
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for assigning employee */}
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
