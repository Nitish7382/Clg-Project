import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { acceptRequest, rejectRequest } from '../Api';

const ViewRequest = () => {
  const location = useLocation();
  const { requestData } = location.state || {};

  const navigator = useNavigate();

  const handleAcceptRequest = async () => {
    try {
      await acceptRequest(requestData.requestId);
      Swal.fire("Success!", "Request accepted successfully!", "success");
      navigator('/admin'); // Go back to the previous page or refresh data
    } catch (error) {
      console.error("Failed to accept request:", error);
      Swal.fire("Error!", "Failed to accept the request.", "error");
    }
  };

  const handleRejectRequest = async () => {
    try {
      await rejectRequest(requestData.requestId);
      Swal.fire("Success!", "Request rejected successfully!", "success");
      navigator('/admin'); // Go back to the previous page or refresh data
    } catch (error) {
      console.error("Failed to reject request:", error);
      Swal.fire("Error!", "Failed to reject the request.", "error");
    }
  };

  const handleCreateCourse = () => {
    navigator('/createCourse', { state: { requestId: requestData.requestId } });
  };

  if (!requestData) {
    return <p>Loading request details...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-blue-100 to-blue-50">
      <div className="p-10 bg-white shadow-md rounded-lg max-w-md">
        <h2 className="text-2xl font-bold mb-4">Request Details</h2>
        <p><strong>Request ID:</strong> {requestData.requestId}</p>
        <p><strong>Course Name:</strong> {requestData.courseName}</p>
        <p><strong>Description:</strong> {requestData.description}</p>
        <p><strong>Concepts:</strong> {requestData.concepts}</p>
        <p><strong>Duration:</strong> {requestData.duration}</p>
        <p><strong>Employee Position:</strong> {requestData.employeePosition}</p>
        <strong>Required Employees:</strong>
        {requestData.requiredEmployees && requestData.requiredEmployees.length > 0 ? (
          <ul className="list-disc ml-5 mt-2">
            {requestData.requiredEmployees.map((employee, index) => (
              <li key={index} className="text-gray-700">
                {employee.username}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mt-2">No employees assigned.</p>
        )}
        <p><strong>Status:</strong> {requestData.status}</p>
        <p><strong>Manager Username:</strong> {requestData.managerUsername}</p>

        <div className="mt-4">
          {requestData.status === 'ACCEPTED' ? (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
              onClick={handleCreateCourse}
            >
              Create Course
            </button>
          ) : requestData.status === 'REJECTED' ? (
            <p className="text-red-500 font-bold">The Request has been REJECTED.</p>
          ) : requestData.status === 'COMPLETED' ? (
            <p className="text-green-500 font-bold">The Request has been ACCEPTED, and Course is CREATED</p>
          ) : (
            <>
              <button
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2"
                onClick={handleAcceptRequest}
              >
                Accept Request
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                onClick={handleRejectRequest}
              >
                Reject Request
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRequest;
