import React, { useEffect, useState } from "react";
import { getAdminCourseStats } from "../Api"; // Import your API call function
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import AdminNavbar from "./AdminNavbar";

const Coursestats = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Fetch course stats data on component mount
    const fetchCourseStats = async () => {
      try {
        const data = await getAdminCourseStats();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching course stats:", error);
      }
    };

    fetchCourseStats();
  }, []);

  // Prepare data for Bar chart
  const barChartData = courses.map((course) => ({
    title: course.title,
    totalAssigned: course.stats.totalAssigned,
    completed: course.stats.completed,
    completionRate: course.stats.completionRate.toFixed(2),
  }));

  // Prepare data for Pie chart
  const pieChartData = [
    {
      name: "Completed",
      value: courses.reduce((acc, course) => acc + course.stats.completed, 0),
    },
    {
      name: "Not Completed",
      value: courses.reduce(
        (acc, course) =>
          acc + (course.stats.totalAssigned - course.stats.completed),
        0
      ),
    },
  ];

  return (
    <div className="container mx-auto bg-gray-900 text-white">
      <AdminNavbar />
      <h1 className="text-3xl font-bold text-center text-purple-400 mb-8">
        Course Stats
      </h1>

      {/* Charts Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        {/* Pie Chart */}
        <div className="flex-1 bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">
            Completion Overview
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            {" "}
            {/* Increased height */}
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={60}
                fill="#82ca9d"
                label
                paddingAngle={5}
                stroke="#fff"
                strokeWidth={2}
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index % 2 === 0 ? "#82ca9d" : "#ff7300"}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#333",
                  border: "none",
                  borderRadius: "10px",
                }}
              />
              <Legend
                verticalAlign="top"
                height={36}
                iconSize={16}
                wrapperStyle={{ fontSize: "14px", color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="flex-1 bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-purple-400 mb-4">
            Course Statistics
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalAssigned" fill="rgba(75, 192, 192, 0.6)" />
              <Bar dataKey="completed" fill="rgba(153, 102, 255, 0.6)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-gray-800 shadow-md rounded-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-purple-400">
                {course.title}
              </h2>
              <p className="mt-2 text-gray-400">{course.description}</p>
              <p className="mt-2 text-sm text-gray-500">
                <strong>Concept:</strong> {course.concept}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                <strong>Duration:</strong> {course.duration}
              </p>

              {/* Video Link */}
              <a
                href={course.videoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600 mt-4 inline-block"
              >
                Watch Video
              </a>

              {/* Stats Section */}
              <div className="mt-6">
                <p>
                  <strong>Total Assigned:</strong> {course.stats.totalAssigned}
                </p>
                <p>
                  <strong>Completed:</strong> {course.stats.completed}
                </p>
                <p>
                  <strong>Completion Rate:</strong>{" "}
                  {course.stats.completionRate.toFixed(2)}%
                </p>
                <p>
                  <strong>Assessments Passed:</strong>{" "}
                  {course.stats.assessmentsPassed}
                </p>
                <p>
                  <strong>Average Rating:</strong> {course.stats.averageRating}
                </p>
                <p>
                  <strong>Total Ratings:</strong> {course.stats.totalRatings}
                </p>
              </div>

              {/* PDF Link */}
              <a
                href={`http://localhost:5000${course.pdfLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-600 mt-4 inline-block"
              >
                Download PDF
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Coursestats;
