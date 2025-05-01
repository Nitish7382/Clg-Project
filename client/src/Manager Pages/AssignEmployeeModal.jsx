import React, { useEffect, useState } from "react";
import { X } from "lucide-react"; // Optional icon for better UX
import { getAllEmployees, getAssignedEmployees, assignCourse } from "../Api";
import Swal from "sweetalert2"; // Import SweetAlert2

const AssignEmployeeModal = ({ isOpen, onClose, courseId }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const [allEmps, assignedEmpIds] = await Promise.all([
          getAllEmployees(),
          getAssignedEmployees(courseId),
        ]);

        const availableEmps = allEmps.filter(
          (emp) => !assignedEmpIds.includes(emp._id)
        );
        setEmployees(availableEmps);
      } catch (error) {
        console.error("Error fetching employees", error);
      }
    };

    if (isOpen) fetchEmployees();
  }, [isOpen, courseId]);

  // Reset selected employees when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedEmployees([]);
      setDropdownOpen(false);
    }
  }, [isOpen]);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const handleSelectEmployee = (empId) => {
    if (!selectedEmployees.includes(empId)) {
      setSelectedEmployees((prev) => [...prev, empId]);
    }
    setDropdownOpen(false);
  };

  const handleRemoveEmployee = (empId) => {
    setSelectedEmployees((prev) => prev.filter((id) => id !== empId));
  };

  const handleAssign = async () => {
    try {
      await assignCourse({ courseId, employeeIds: selectedEmployees });
      
      // SweetAlert2 success alert
      Swal.fire({
        icon: 'success',
        title: 'Course Assigned Successfully',
        text: 'The selected employees have been assigned the course.',
      });

      onClose();
    } catch (error) {
      console.error("Error assigning course", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[450px] space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Assign Course</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
            title="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Custom Employee Selector */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Select Employees:
          </label>

          {/* Selected Employee Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedEmployees.map((empId) => {
              const emp = employees.find((e) => e._id === empId);
              return (
                <div
                  key={empId}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  <span className="mr-2 text-sm">
                    {emp?.Name} - {emp?.Designation}
                  </span>
                  <button
                    onClick={() => handleRemoveEmployee(empId)}
                    className="text-blue-600 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-left text-black hover:bg-gray-100"
            >
              {dropdownOpen ? "Close Employee List" : "Select Employees"}
            </button>

            {dropdownOpen && (
              <div className="absolute mt-1 max-h-60 w-full overflow-y-auto border border-gray-300 rounded bg-white z-10 shadow-md">
                {employees.filter((emp) => !selectedEmployees.includes(emp._id))
                  .length === 0 ? (
                  <div className="px-4 py-2 text-gray-500 italic">
                    This course is assigned to all the employees.
                  </div>
                ) : (
                  employees
                    .filter((emp) => !selectedEmployees.includes(emp._id))
                    .map((emp) => (
                      <div
                        key={emp._id}
                        onClick={() => handleSelectEmployee(emp._id)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                      >
                        {emp.Name} - {emp.Designation}
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={selectedEmployees.length === 0}
            className={`px-4 py-2 rounded text-white ${
              selectedEmployees.length === 0
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignEmployeeModal;
