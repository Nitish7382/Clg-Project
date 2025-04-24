import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submitFeedback } from "../Api";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";

const GiveFeedback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { courseId, employeeId } = location.state || {};

    const [formData, setFormData] = useState({
        employeeId: employeeId || null,
        courseId: courseId || null,
        rating: "",
        comment: "",
    });

    const [hoverRating, setHoverRating] = useState(null); // State for hover effect
    const [error, setError] = useState("");

    useEffect(() => {
        // Set the body background color to the gradient when this component is mounted
        document.body.classList.add("bg-gradient-to-r", "from-blue-200", "via-blue-100", "to-blue-50");

        // Cleanup: Reset the background color when this component is unmounted
        return () => {
            document.body.classList.remove("bg-gradient-to-r", "from-blue-200", "via-blue-100", "to-blue-50");
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRatingChange = (rating) => {
        setFormData({ ...formData, rating });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.rating || !formData.comment) {
            setError("All fields are required.");
            return;
        }

        if (![1, 2, 3, 4, 5].includes(Number(formData.rating))) {
            setError("Rating must be 1, 2, 3, 4, or 5.");
            return;
        }

        try {
            setError(""); // Clear any previous errors
            console.log(formData);
            const response = await submitFeedback(formData);
            console.log("Feedback submitted successfully:", response);
            Swal.fire("Success!", "Feedback submitted successfully!", "success");
            navigate("/thankyou"); // Redirect to a thank-you page
        } catch (err) {
            console.error("Error submitting feedback:", err);
            setError("Failed to submit feedback. Please try again.");
        }
    };

    // Labels based on the rating
    const ratingLabels = [
        { text: "Worst", color: "text-red-500" },  // Rating 1
        { text: "Bad", color: "text-yellow-600" }, // Rating 2
        { text: "Average", color: "text-yellow-400" }, // Rating 3
        { text: "Good", color: "text-green-500" }, // Rating 4
        { text: "Best", color: "text-green-700" }   // Rating 5
    ];

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-xl rounded">
            <h2 className="text-2xl font-bold mb-4 ml-32">Give Feedback</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold text-xl">Rating (1-5)</label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                                key={star}
                                onClick={() => handleRatingChange(star)}
                                onMouseEnter={() => setHoverRating(star)} // Set hover rating
                                onMouseLeave={() => setHoverRating(null)} // Reset hover rating
                                size={50}
                                className={`cursor-pointer ml-5 ${
                                    (formData.rating || hoverRating) >= star
                                        ? "text-yellow-500"
                                        : "text-gray-300"
                                } transition-colors duration-200`}
                            />
                        ))}
                    </div>
                    {/* Show label according to selected or hovered rating */}
                    <div className="mt-2 text-center">
                        {formData.rating || hoverRating
                            ? (
                                <span
                                    className={`text-xl font-semibold ${ratingLabels[(formData.rating || hoverRating) - 1].color}`}
                                >
                                    {ratingLabels[(formData.rating || hoverRating) - 1].text}
                                </span>
                            )
                            : (
                                <span className="text-gray-500 text-xl">Select a Rating</span>
                            )}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 text-xl font-bold">Comment</label>
                    <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        rows="3"
                        placeholder="Enter your comment"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};

export default GiveFeedback;
