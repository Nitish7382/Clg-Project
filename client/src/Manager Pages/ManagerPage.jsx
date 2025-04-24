import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getManagerRequests, createRequest } from "../Api";
import ManagerNavbar from "./ManagerNavbar";
import Swal from "sweetalert2"; // <-- Add this line

function ManagerPage() {
  const [requests, setRequests] = useState([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [completedRequests, setCompletedRequests] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    concept: "",
    duration: "",
  });

  const navigator = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const fetchedRequests = await getManagerRequests();
        setRequests(fetchedRequests);
        setTotalRequests(fetchedRequests.length);
        setCompletedRequests(
          fetchedRequests.filter((r) => r.status === "Approved").length
        );
        setPendingRequests(
          fetchedRequests.filter((r) => r.status === "Pending").length
        );
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleNewRequest = () => {
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      await createRequest(formData);
      setShowModal(false);
      setFormData({ title: "", description: "", concept: "", duration: "" });

      Swal.fire({
        icon: "success",
        title: "Request Created!",
        text: "Your request has been submitted successfully.",
        confirmButtonColor: "#22c55e", // Tailwind green-600
      });

      const updatedRequests = await getManagerRequests(); // <-- fixed: you had `getRequests()` instead
      setRequests(updatedRequests);
      setTotalRequests(updatedRequests.length);
      setCompletedRequests(
        updatedRequests.filter((r) => r.status === "Completed").length
      );
      setPendingRequests(
        updatedRequests.filter((r) => r.status === "Pending").length
      );
    } catch (err) {
      console.error("Error creating request:", err);
      Swal.fire({
        icon: "error",
        title: "Creation Failed",
        text: "There was an issue submitting your request.",
        confirmButtonColor: "#dc2626", // Tailwind red-600
      });
    }
  };

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
  };

  const closeCard = () => {
    setSelectedRequest(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <ManagerNavbar />

      <div className="px-6 py-8">
        {/* Stats Cards */}
        <div className="flex gap-8 justify-between mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px] h-24 bg-blue-600 flex flex-col items-center justify-center rounded-lg shadow hover:bg-blue-700 transition">
            <p className="text-lg">Total Requests</p>
            <p className="text-2xl font-bold">{totalRequests}</p>
          </div>

          <div className="flex-1 min-w-[200px] h-24 bg-purple-600 flex flex-col items-center justify-center rounded-lg shadow hover:bg-purple-700 transition">
            <p className="text-lg">Completed Requests</p>
            <p className="text-2xl font-bold">{completedRequests}</p>
          </div>

          <div className="flex-1 min-w-[200px] h-24 bg-yellow-600 flex flex-col items-center justify-center rounded-lg shadow hover:bg-yellow-700 transition">
            <p className="text-lg">Pending Requests</p>
            <p className="text-2xl font-bold">{pendingRequests}</p>
          </div>
        </div>

        {/* Create Request Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleNewRequest}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
          >
            Create New Request
          </button>
        </div>

        {/* Requests Table */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg p-6 rounded-lg overflow-auto">
          <div className="max-h-[300px] overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-400 text-black sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 text-left">Sl No</th>
                  <th className="py-3 px-4 text-left">Training Program</th>
                  <th className="py-3 px-4 text-left">Duration</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Course created</th>
                  <th className="py-3 px-4 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/20 hover:bg-white/10 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{request.title}</td>
                    <td className="py-3 px-4">{request.duration}</td>
                    <td className="py-3 px-4">{request.status}</td>
                    <td className="py-3 px-4">
                      {request.courseCreated ? "Yes" : "No"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-300">
                      No requests available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Request Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm bg-opacity-70 z-50">
          <div className="bg-white text-black p-6 shadow-lg rounded-md w-11/12 md:w-2/3 lg:w-1/2 relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-2xl"
              onClick={closeCard}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Request Details</h2>
            <p>
              <strong>Course Title:</strong> {selectedRequest.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedRequest.description}
            </p>
            <p>
              <strong>Concepts:</strong> {selectedRequest.concept}
            </p>
            <p>
              <strong>Duration:</strong> {selectedRequest.duration}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={
                  selectedRequest.status === "Approved"
                    ? "text-green-600"
                    : selectedRequest.status === "Pending"
                    ? "text-purple-600"
                    : "text-red-600"
                }
              >
                {selectedRequest.status}
              </span>
            </p>

            <p>
              <strong>Course Created:</strong>{" "}
              <span
                className={
                  selectedRequest.courseCreated
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {selectedRequest.courseCreated ? "Yes" : "No"}
              </span>
            </p>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded-md shadow-lg w-11/12 md:w-2/3 lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4">Create New Request</h2>
            <div className="grid gap-4">
              <input
                type="text"
                placeholder="Title"
                className="border p-2 rounded"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <textarea
                placeholder="Description"
                className="border p-2 rounded"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Concepts"
                className="border p-2 rounded"
                value={formData.concept}
                onChange={(e) =>
                  setFormData({ ...formData, concept: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Duration"
                className="border p-2 rounded"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagerPage;
