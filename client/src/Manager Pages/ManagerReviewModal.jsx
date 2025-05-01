import React, { useEffect, useRef } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { HiX } from "react-icons/hi";

const ReviewModal = ({ isOpen, onClose, ratings }) => {
  const modalRef = useRef(null);

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, index) => {
      if (rating >= index + 1)
        return <FaStar key={index} className="text-yellow-400" />;
      else if (rating >= index + 0.5)
        return <FaStarHalfAlt key={index} className="text-yellow-400" />;
      else return <FaRegStar key={index} className="text-yellow-400" />;
    });

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-[#0f172a] rounded-2xl p-6 w-full max-w-xl shadow-xl relative border border-gray-200"
      >
        {/* X Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <HiX size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-sky-600 text-center">
          Course Reviews
        </h2>

        <div
          className={`space-y-4 ${
            ratings.length > 3 ? "overflow-y-scroll max-h-96 pr-2" : ""
          } custom-scrollbar`}
        >
          {ratings.length === 0 ? (
            <p className="text-gray-400 text-center">No reviews available.</p>
          ) : (
            ratings.map((r, idx) => (
              <div
                key={idx}
                className="flex gap-4 items-start border-b border-gray-200 pb-4"
              >
                {/* Avatar */}
                <div className="w-10 h-10 bg-sky-500 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                  {r.employeeId?.Name ? r.employeeId.Name[0] : "U"}
                </div>

                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-white">
                      {r.employeeId?.Name || "Anonymous"}
                    </p>
                    <div className="flex">{renderStars(r.rating)}</div>
                  </div>
                  <p className="text-sm text-gray-200 mt-1">{r.review}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
