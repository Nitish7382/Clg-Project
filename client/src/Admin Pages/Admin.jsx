import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Navbar from "./AdminNavbar";
import {
  getRequests,
  acceptRequest,
  rejectRequest,
  getAllEmployeesAdmin,
  deleteRequest,
} from "../Api";

function Admin() {
  const [allrequests, setAllRequests] = useState([]);
  const [totalRequestsCount, setTotalRequestsCount] = useState(0);
  const [respondedRequests, setRespondedRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const navigator = useNavigate();

  const fetchData = async () => {
    try {
      const requests = await getRequests();
      setAllRequests(requests);
      setTotalRequestsCount(requests.length);

      setPendingRequests(requests.filter((r) => r.status === "Pending"));
      setRespondedRequests(
        requests.filter(
          (r) => r.status === "Approved" || r.status === "Rejected"
        )
      );
      setCompletedRequests(
        requests.filter((r) => r.courseCreated === true).length
      );

      const employees = await getAllEmployeesAdmin();
      setEmployeeCount(employees.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewRequest = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleAccept = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to accept this request!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!",
    });

    if (confirm.isConfirmed) {
      try {
        await acceptRequest(selectedRequest._id);
        Swal.fire("Accepted!", "The request has been approved.", "success");
        setShowModal(false);
        fetchData();
      } catch (error) {
        console.error("Failed to accept request:", error);
      }
    }
  };

  const handleReject = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to reject this request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!",
    });

    if (confirm.isConfirmed) {
      try {
        await rejectRequest(selectedRequest._id);
        Swal.fire("Rejected!", "The request has been rejected.", "success");
        setShowModal(false);
        fetchData();
      } catch (error) {
        console.error("Failed to reject request:", error);
      }
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the request!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteRequest(selectedRequest._id);
        Swal.fire("Deleted!", "The request has been deleted.", "success");
        setShowModal(false);
        fetchData(); // Refresh the data
      } catch (error) {
        console.error("Failed to delete request:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a40] to-[#000000]">
      <Navbar />

      <div className="p-8">
        <h2 className="text-4xl font-extrabold text-center text-white mb-10">
          Admin Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {[
            {
              value: completedRequests,
              label: "Courses Created",
              color: "from-blue-500 to-indigo-600",
            },
            {
              value: employeeCount,
              label: "Employees",
              color: "from-green-400 to-teal-600",
            },
            {
              value: totalRequestsCount,
              label: "Requests",
              color: "from-purple-400 to-pink-600",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className={`bg-gradient-to-br ${card.color} text-white p-6 rounded-full shadow-lg`}
            >
              <p className="text-6xl font-extrabold text-center">
                {card.value}
              </p>
              <p className="text-lg font-medium text-center">{card.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Conditionally render Pending Requests only if available */}

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg p-6 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-yellow-400">
              Pending Requests
            </h3>
            <div className="overflow-y-auto max-h-[16rem]">
              <table className="w-full text-left text-white">
                <thead className="sticky top-0 bg-[#1f2937] z-10">
                  {" "}
                  {/* updated */}
                  <tr>
                    <th className="p-3">Sl No</th>
                    <th className="p-3">Manager Name</th>
                    <th className="p-3">Training Program</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((request, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-white/20 hover:bg-white/20 transition"
                      >
                        <td className="p-3">{idx + 1}</td>
                        <td className="p-3">
                          {request.managerId?.Name || "N/A"}
                        </td>
                        <td className="p-3">{request.title}</td>
                        <td className="p-3">
                          <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-4 rounded"
                            onClick={() => handleViewRequest(request)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="p-4 text-center text-white" colSpan="4">
                        No pending requests
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Completed Requests Table */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg p-6 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-4 text-green-400">
              Completed Requests
            </h3>
            <div className="overflow-y-auto max-h-[16rem]">
              <table className="w-full text-left text-white">
                <thead className="sticky top-0 bg-[#1f2937] z-10">
                  <tr className="bg-white/20">
                    <th className="p-3">Sl No</th>
                    <th className="p-3">Manager Name</th>
                    <th className="p-3">Training Program</th>
                    <th className="p-3">Course Created</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {respondedRequests.map((request, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-white/20 hover:bg-white/20 transition"
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3">
                        {request.managerId?.Name || "N/A"}
                      </td>
                      <td className="p-3">{request.title}</td>
                      <td className="p-3">
                        <span
                          className={
                            request.courseCreated
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {request.courseCreated ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-4 rounded"
                          onClick={() => handleViewRequest(request)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-xs bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[500px] shadow-xl">
            <h2 className="text-xl font-bold mb-4">Request Details</h2>
            <p>
              <strong>Manager Name:</strong> {selectedRequest.managerId?.Name}
            </p>
            <p>
              <strong>Manager Email:</strong> {selectedRequest.managerId?.email}
            </p>
            <p>
              <strong>Manager ID:</strong> {selectedRequest.managerId?.ID}
            </p>
            <p>
              <strong>Title:</strong> {selectedRequest.title}
            </p>
            <p>
              <strong>Description:</strong> {selectedRequest.description}
            </p>
            <p>
              <strong>Concept:</strong> {selectedRequest.concept}
            </p>
            <p>
              <strong>Duration:</strong> {selectedRequest.duration}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  selectedRequest.status === "Rejected"
                    ? "text-red-500"
                    : selectedRequest.status === "Approved"
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}
              >
                {selectedRequest.status}
              </span>
            </p>
            <p>
              <strong>Course Created:</strong>{" "}
              <span
                className={`font-semibold ${
                  selectedRequest.courseCreated
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {selectedRequest.courseCreated ? "Yes" : "No"}
              </span>
            </p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              {selectedRequest.status === "Pending" && (
                <>
                  <button
                    onClick={handleReject}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                  <button
                    onClick={handleAccept}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>
                </>
              )}

              {selectedRequest.status === "Approved" &&
                !selectedRequest.courseCreated && (
                  <button
                    onClick={() =>
                      navigator("/createcourse", {
                        state: { requestId: selectedRequest._id },
                      })
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Create Course
                  </button>
                )}

              {selectedRequest.status === "Rejected" && (
                <button
                  onClick={handleDelete}
                  className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
                >
                  Delete Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
