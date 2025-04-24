import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { createAssessmet } from '../Api';

const CreateAssessments = () => {
  const [totalMarks, setTotalMarks] = useState(0);
  const [passingMarks, setPassingMarks] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [formQuestions, setFormQuestions] = useState([]);

  const location = useLocation();
  const { courseId } = location.state || {};  // Get courseId from state
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) {
      Swal.fire("Error!", "Course information not found!", "error");
      navigate('/courselist');  // Navigate back to course list if courseId is missing
    }
  }, [courseId, navigate]);

  const handleSetTotalQuestions = (e) => {
    const value = parseInt(e.target.value, 10);
    setTotalQuestions(value);

    const initialQuestions = Array(value).fill(null).map(() => ({
      questionText: '',
      options: Array(4).fill(''),
      correctAnswer: 0,
    }));
    setFormQuestions(initialQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...formQuestions];
    updated[index].questionText = value;
    setFormQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...formQuestions];
    updated[qIndex].options[optIndex] = value;
    setFormQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, indexValue) => {
    const updated = [...formQuestions];
    updated[qIndex].correctAnswer = parseInt(indexValue);
    setFormQuestions(updated);
  };

  const handleSubmitForm = async () => {
    if (!courseId) {
      Swal.fire("Error", "Course information is missing!", "error");
      return;
    }

    const isValid = formQuestions.every(
      (q) => q.questionText.trim() && q.options.every((opt) => opt.trim())
    );

    if (!isValid) {
      Swal.fire("Validation Error", "Please fill out all questions and options.", "warning");
      return;
    }

    const payload = {
      totalMarks: Number(totalMarks),
      passingMarks: Number(passingMarks),
      numberOfQuestions: Number(totalQuestions),
      questions: formQuestions.map((q) => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
      })),
    };

    try {
      await createAssessmet(courseId, payload);  // Pass courseId to the API
      Swal.fire("Success!", "Assessment created successfully!", "success");
      navigate('/courselist');
    } catch (error) {
      console.error("Error creating assessment:", error);
      Swal.fire("Error!", "Failed to create assessment. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Create Assessment</h1>

        {/* Number of Questions */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Number of Questions</label>
          <input
            type="number"
            value={totalQuestions}
            onChange={handleSetTotalQuestions}
            min="1"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Total Marks */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Total Marks</label>
          <input
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
            min="1"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Passing Marks */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Passing Marks</label>
          <input
            type="number"
            value={passingMarks}
            onChange={(e) => setPassingMarks(e.target.value)}
            min="1"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Questions */}
        {formQuestions.map((question, qIndex) => (
          <div key={qIndex} className="mb-6 p-4 border bg-gray-50 rounded">
            <h3 className="font-semibold text-lg mb-2">Question {qIndex + 1}</h3>
            <input
              type="text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="w-full p-2 border rounded mb-3"
              placeholder="Enter the question"
            />

            {/* Options */}
            <div className="space-y-3">
              {question.options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-3">
                  <label className="w-24 text-gray-700">Option {optIndex + 1}</label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                    className="flex-grow p-2 border rounded"
                    placeholder={`Enter option ${optIndex + 1}`}
                  />
                </div>
              ))}
            </div>

            {/* Correct Answer Index */}
            <div className="mt-4">
              <label className="block font-medium text-gray-700 mb-2">Correct Option</label>
              <select
                value={question.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)}
                className="w-full p-2 border rounded"
              >
                {question.options.map((opt, i) => (
                  <option key={i} value={i}>
                    Option {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        {/* Submit Button */}
        {totalQuestions > 0 && (
          <button
            onClick={handleSubmitForm}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Submit Assessment
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateAssessments;
