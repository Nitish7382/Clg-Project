import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createRequest, getAllEmployees } from "../Api";

function Managerrequest() {
  const [formData, setFormData] = useState({
    courseName: "",
    description: "",
    concepts: "",
    duration: "",
    employeePosition: "",
    requiredEmployees: [],
  });

  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getAllEmployees();
        setEmployees(response);
      } catch (error) {
        console.error("Failed to fetch employees", error);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeSelect = (e) => {
    const employeeId = parseInt(e.target.value, 10);
    const selectedEmployee = employees.find((emp) => emp.employeeId === employeeId);

    if (selectedEmployee && !formData.requiredEmployees.some((emp) => emp.employeeId === employeeId)) {
      setFormData((prev) => ({
        ...prev,
        requiredEmployees: [...prev.requiredEmployees, selectedEmployee],
      }));
    }
  };

  const handleRemoveEmployee = (employeeId) => {
    const employee = formData.requiredEmployees.find((emp) => emp.employeeId === employeeId);

    Swal.fire({
      title: `Remove ${employee?.accountName}?`,
      text: "This will remove the employee from your list.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove",
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData((prev) => ({
          ...prev,
          requiredEmployees: prev.requiredEmployees.filter((emp) => emp.employeeId !== employeeId),
        }));
      }
    });
  };

  const handleClearEmployees = () => {
    if (formData.requiredEmployees.length === 0) return;

    Swal.fire({
      title: "Clear all selected employees?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, clear all",
    }).then((result) => {
      if (result.isConfirmed) {
        setFormData((prev) => ({
          ...prev,
          requiredEmployees: [],
        }));
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createRequest(formData);
      if (response.data === "Request created successfully") {
        Swal.fire("Success!", "Request created successfully", "success");
        navigate("/manager");
      } else {
        Swal.fire("Error!", "Request creation failed", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Request creation failed", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg p-8 rounded-xl w-full max-w-2xl"
      >
        <h2 className="text-center text-2xl font-bold mb-6">Create Request</h2>

        <button
          type="button"
          onClick={() => navigate("/manager")}
          className="mb-4 text-sm text-blue-400 hover:underline"
        >
          ← Back to Dashboard
        </button>

        {/* Text Fields */}
        {["courseName", "description", "concepts", "duration"].map((field) => (
          <div key={field} className="mb-4">
            <input
              type="text"
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1").trim()}
              className="w-full px-4 py-2 rounded border border-white/30 bg-transparent placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData[field]}
              onChange={handleChange}
            />
            {field === "description" && (
              <div className="text-xs text-gray-400 mt-1 text-right">
                {formData.description.length} / 300
              </div>
            )}
          </div>
        ))}

        {/* Position Dropdown */}
        <div className="mb-4">
          <label htmlFor="employeePosition" className="block mb-1 font-medium">
            Employee Position
          </label>
          <select
            name="employeePosition"
            value={formData.employeePosition}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded border border-white/30 bg-transparent text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option className="text-black" value="">Select a Position</option>
            <option className="text-black" value="Developer">Developer</option>
            <option className="text-black" value="QA Tester">QA Tester</option>
            <option className="text-black" value="Business Analyst">Business Analyst</option>
            <option className="text-black" value="UI/UX Designer">UI/UX Designer</option>
            <option className="text-black" value="DevOps Engineer">DevOps Engineer</option>
          </select>
        </div>

        {/* Employee Dropdown */}
        <label className="block font-medium mb-2">Select Employees:</label>
        <select
          onChange={handleEmployeeSelect}
          className="w-full mb-4 px-4 py-2 border border-white/30 bg-transparent text-white rounded placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option className="text-black" value="">Select an Employee</option>
          {employees.map((employee) => (
            <option
              key={employee.employeeId}
              value={employee.employeeId}
              className="text-black"
            >
              {employee.accountName} - {employee.email}
            </option>
          ))}
        </select>

        {/* Selected Employees */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium">Selected Employees:</p>
            {formData.requiredEmployees.length > 0 && (
              <button
                type="button"
                className="text-red-300 text-sm hover:underline"
                onClick={handleClearEmployees}
              >
                Clear All
              </button>
            )}
          </div>

          {formData.requiredEmployees.length > 0 ? (
            formData.requiredEmployees.map((emp) => (
              <div
                key={emp.employeeId}
                className="flex justify-between items-center bg-white/20 rounded px-4 py-2 mb-2"
              >
                <span>{emp.accountName}</span>
                <button
                  type="button"
                  className="text-red-400 hover:text-red-600"
                  onClick={() => handleRemoveEmployee(emp.employeeId)}
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No employees selected.</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}

export default Managerrequest;
