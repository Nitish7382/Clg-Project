import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getManagerViewAssessments } from "../Api";
import ManagerNavbar from "./ManagerNavbar";

const ViewAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.state?.courseId;

  useEffect(() => {
    const fetchAssessments = async () => {
      if (!courseId) return;
      try {
        const data = await getManagerViewAssessments(courseId);
        setAssessments(data);
      } catch (error) {
        console.error("Failed to fetch assessments", error);
      }
    };

    fetchAssessments();
  }, [courseId]);

  return (
    <div>
      <ManagerNavbar />

      <div className="bg-gradient-to-br from-blue-900 via-gray-900 to-black min-h-screen p-6 text-white">
        <h1 className="text-3xl font-bold mb-8 text-blue-400 text-center">
          Assessments
        </h1>

        {assessments.length === 0 ? (
          <p className="text-gray-400 text-center">No assessments available.</p>
        ) : (
          assessments.map((assessment) => (
            <div
              key={assessment._id}
              className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 border border-blue-700"
            >
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">
                Assessment Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm text-gray-300">
                <p>
                  <span className="font-medium text-blue-400">Total Marks:</span>{" "}
                  {assessment.totalMarks}
                </p>
                <p>
                  <span className="font-medium text-blue-400">Passing Marks:</span>{" "}
                  {assessment.passingMarks}
                </p>
                <p>
                  <span className="font-medium text-blue-400">No. of Questions:</span>{" "}
                  {assessment.numberOfQuestions}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-300">
                  Questions
                </h3>
                {assessment.questions.map((q, index) => (
                  <div
                    key={q._id}
                    className="mb-4 p-4 bg-gray-700 rounded-xl border border-gray-600 shadow-sm"
                  >
                    <p className="mb-2 font-medium text-white">
                      <span className="text-blue-400 font-semibold">
                        Q{index + 1}:
                      </span>{" "}
                      {q.questionText}
                    </p>
                    <ul className="pl-5 list-disc space-y-1">
                      {q.options.map((option, i) => (
                        <li
                          key={i}
                          className={`${
                            i === q.correctAnswer
                              ? "text-green-400 font-semibold"
                              : "text-gray-300"
                          }`}
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}

        {/* Back Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={() => navigate("/manager-course-list")}
            className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
          >
            Back to Course
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAssessments;
