  import React, { useState, useEffect } from 'react';
  import { useLocation, useNavigate, useParams } from 'react-router-dom';
  import Swal from 'sweetalert2';
  import { updateAssessment, getAssessmentById } from '../Api';

  const UpdateAssessment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { courseId } = location.state;

    const [totalMarks, setTotalMarks] = useState(0);
    const [passingMarks, setPassingMarks] = useState(0);
    const [formQuestions, setFormQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assessmentDetails, setAssessmentDetails] = useState(null);

    useEffect(() => {
      const fetchAssessment = async () => {
        try {
          const res = await getAssessmentById(courseId);
          console.log("Assessment Data:", res.data.assessment); // Log the assessment data
    
          const data = res.data.assessment;
          setAssessmentDetails(data);
          setTotalMarks(data.totalMarks);
          setPassingMarks(data.passingMarks);
    
          const formattedQuestions = data.questions.map((q) => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
          }));
          setFormQuestions(formattedQuestions);
        } catch (err) {
          console.error("Error fetching assessment:", err);
          Swal.fire("Error", "Failed to load assessment data.", "error");
          navigate('/courselist');
        } finally {
          setLoading(false);
        }
      };
    
      fetchAssessment();
    }, [courseId, navigate]);
    

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

    const handleCorrectAnswerChange = (qIndex, value) => {
      const updated = [...formQuestions];
      updated[qIndex].correctAnswer = value;
      setFormQuestions(updated);
    };

    const handleRemoveQuestion = (index) => {
      const updated = [...formQuestions];
      updated.splice(index, 1);
      setFormQuestions(updated);
    };

    const handleAddQuestion = () => {
      setFormQuestions([
        ...formQuestions,
        {
          questionText: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
        },
      ]);
    };

    const handleSubmitForm = async (e) => {
      e.preventDefault();

      const isValid = formQuestions.every((q) =>
        q.questionText.trim() &&
        q.options.every((opt) => opt.trim()) &&
        q.correctAnswer !== undefined
      );

      if (!isValid) {
        return Swal.fire({
          title: 'Please fill out all questions, options, and select a correct answer.',
          icon: "question"
        });
      }

      const payload = {
        courseId,
        questions: formQuestions,
        totalMarks: Number(totalMarks),
        passingMarks: Number(passingMarks),
        numberOfQuestions: formQuestions.length,
      };

      try {
        const response = await updateAssessment(courseId, payload);
        Swal.fire("Success!", "Assessment updated successfully!", "success");
        navigate('/courselist');
      } catch (error) {
        console.error('Error updating assessment:', error);
        Swal.fire("Error!", "Failed to update assessment. Please try again.", "error");
      }
    };

    if (loading) return <div className="text-center mt-10 text-xl">Loading...</div>;

    return (
      <div className="min-h-screen bg-gray-200 p-6">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Update Assessment</h1>

          {/* Total Marks */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">Total Marks</label>
            <input
              type="number"
              onChange={(e) => setTotalMarks(e.target.value)}
              value={totalMarks}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter total marks"
            />
          </div>

          {/* Passing Marks */}
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">Passing Marks</label>
            <input
              type="number"
              onChange={(e) => setPassingMarks(e.target.value)}
              value={passingMarks}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter passing marks"
            />
          </div>

          {/* Questions */}
          {formQuestions.map((question, qIndex) => (
            <div key={qIndex} className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Question {qIndex + 1}</h3>

              <input
                type="text"
                value={question.questionText}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                className="w-full px-4 py-2 mb-4 border rounded-lg"
                placeholder="Enter the question"
              />

              <div className="space-y-4">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center space-x-4">
                    <label>Option {optIndex + 1}</label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                      className="flex-grow px-4 py-2 border rounded-lg"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block mb-2">Correct Answer</label>
                <select
                  value={question.correctAnswer}
                  onChange={(e) => handleCorrectAnswerChange(qIndex, parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value={0}>Option 1</option>
                  <option value={1}>Option 2</option>
                  <option value={2}>Option 3</option>
                  <option value={3}>Option 4</option>
                </select>
              </div>

              <button
                onClick={() => handleRemoveQuestion(qIndex)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Remove This Question
              </button>
            </div>
          ))}

          <div className="flex justify-center mt-6">
            <button
              onClick={handleAddQuestion}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add New Question
            </button>
          </div>

          <button
            onClick={handleSubmitForm}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Update Assessment
          </button>
        </div>
      </div>
    );
  };

  export default UpdateAssessment;
