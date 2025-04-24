import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getManagerViewAssessments } from "../Api";

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
    <div className="bg-gray-900 min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Assessments</h1>

      {assessments.length === 0 ? (
        <p>No assessments available.</p>
      ) : (
        assessments.map((assessment) => (
          <div
            key={assessment._id}
            className="bg-gray-800 rounded-lg p-4 mb-6 shadow"
          >
            <h2 className="text-xl font-semibold mb-2">Assessment</h2>
            <p>
              <span className="font-medium">Total Marks:</span>{" "}
              {assessment.totalMarks}
            </p>
            <p>
              <span className="font-medium">Passing Marks:</span>{" "}
              {assessment.passingMarks}
            </p>
            <p>
              <span className="font-medium">No. of Questions:</span>{" "}
              {assessment.numberOfQuestions}
            </p>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Questions</h3>
              {assessment.questions.map((q, index) => (
                <div key={q._id} className="mb-4 p-3 bg-gray-700 rounded-md">
                  <p className="mb-2">
                    <span className="font-medium">Q{index + 1}:</span>{" "}
                    {q.questionText}
                  </p>
                  <ul className="pl-5 list-disc">
                    {q.options.map((option, i) => (
                      <li
                        key={i}
                        className={`${
                          i === q.correctAnswer
                            ? "text-green-400 font-semibold"
                            : ""
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
          className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
        >
          Back to Course
        </button>
      </div>
    </div>
  );
};

export default ViewAssessments;
