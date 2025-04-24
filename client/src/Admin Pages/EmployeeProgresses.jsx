import React, { useEffect, useState } from "react";
import Navbar from './AdminNavbar';
import { useNavigate } from 'react-router-dom';
import { getAllCourseProgress } from "../Api";

const EmployeeProgresses = () => {
  const [ProgressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchCourseProgress = async () => {
      try {
        const data = await getAllCourseProgress();
        setProgressData(data);
      } catch (error) {
        console.error("Error fetching course progress:", error);
      }
    };

    fetchCourseProgress();
  }, []);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-teal-200">
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl font-semibold text-gray-800 text-center">Employee Progress Overview</h2>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="min-w-full text-left table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-center">
                <th className="py-3 px-6">Employee Name</th>
                <th className="py-3 px-6">Course Name</th>
                <th className="py-3 px-6">Progress (%)</th>
              </tr>
            </thead>
            <tbody>
              {ProgressData.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"} hover:bg-gray-200 transition text-center`}
                >
                  <td className="py-3 px-6 font-medium ">{item.employee.username}</td>
                  <td className="py-3 px-6 text-black">{item.course.courseName}</td>
                  <td className="py-3 px-6 text-black">{item.progressPercentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProgresses;
