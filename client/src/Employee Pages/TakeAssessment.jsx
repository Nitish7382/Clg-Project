import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAssessment, submitAssessment } from "../Api";
import Swal from "sweetalert2";

const TakeAssessment = () => {
  const location = useLocation();
  const { courseId, employeeId } = location.state || {};
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});

  const handleBack = () => navigate("/employee");

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const data = await getAssessment(courseId);
        setAssessment(data[0]);
      } catch (error) {
        console.error("Error fetching assessment:", error);
      }
    };

    fetchAssessment();
  }, [courseId]);

  const handleOptionChange = (questionIndex, selectedOptionIndex) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedOptionIndex,
    }));
  };

  const handleSubmit = async () => {
    const formattedAnswers = {};
    assessment.questions.forEach((q, index) => {
      if (answers[index] !== undefined && answers[index] !== "") {
        formattedAnswers[q._id] = String(answers[index]);
      }
    });

    const submissionData = {
      assessmentId: assessment._id,
      employeeId,
      answers: formattedAnswers,
    };

    try {
      const result = await submitAssessment(submissionData);
      if (result.message === "Assessment submitted") {
        Swal.fire({
          icon: "success",
          title: "Congratulations!",
          text: "You have successfully Completed the assessment!",
          confirmButtonText: "Back to My Learnings",
        }).then((res) => {
          if (res.isConfirmed) {
            navigate("/employee");
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Assessment Failed",
          text: "Please try again.",
          confirmButtonText: "Return to Home",
        }).then(() => navigate("/employee"));
      }
    } catch (error) {
      console.error("Error submitting assessment:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was an error submitting your assessment. Please try again.",
      });
    }
  };

  if (!assessment?.questions?.length) {
    return (
      <p className="p-6 text-gray-700">
        No questions found for this assessment.
      </p>
    );
  }

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">Assessment</h1>

      <div className="space-y-6">
        {assessment.questions.map((question, index) => (
          <div
            key={question._id}
            className="p-4 bg-gray-700 shadow rounded-lg text-white"
          >
            <p className="font-medium">
              {index + 1}. {question.questionText}
            </p>
            <div className="mt-2 space-y-2">
              {question.options.map((optionText, i) => (
                <label key={i} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={i}
                    checked={answers[index] === i}
                    onChange={() => handleOptionChange(index, i)}
                  />
                  <span>{optionText}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
};

export default TakeAssessment;
