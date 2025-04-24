import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const AdminReviewModal = ({ isOpen, onClose, ratings }) => {
  if (!isOpen) return null;

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => {
      if (rating >= index + 1) return <FaStar key={index} className="text-yellow-400" />;
      else if (rating >= index + 0.5) return <FaStarHalfAlt key={index} className="text-yellow-400" />;
      else return <FaRegStar key={index} className="text-yellow-400" />;
    });

  return (
    <div className="fixed inset-0 bg-white/20 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Course Reviews</h2>

        <div className={`space-y-4 ${ratings.length > 3 ? "overflow-y-scroll max-h-96 pr-2" : ""} custom-scrollbar`}>
          {ratings.length === 0 ? (
            <p className="text-gray-500">No reviews available.</p>
          ) : (
            ratings.map((r, idx) => (
              <div key={idx} className="flex gap-4 items-start border-b pb-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                  {r.employeeId?.Name ? r.employeeId.Name[0] : "U"}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-800">
                      {r.employeeId?.Name || "Anonymous"}
                    </p>
                    <div className="flex">{renderStars(r.rating)}</div>
                  </div>
                  <p className="text-gray-600 mt-1">{r.review}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AdminReviewModal;
