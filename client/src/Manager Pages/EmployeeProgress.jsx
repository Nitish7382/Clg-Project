import React, { useEffect, useState } from 'react'
import ManagerNavbar from './ManagerNavbar'
import { getAllCourseProgress } from '../Api'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const COLORS_PROGRESS = ['#34D399', '#F59E0B'] // Green for Completed, Amber for In Progress
const COLORS_RATINGS = ['#10B981', '#3B82F6', '#F59E0B', '#F97316', '#EF4444'] // Distinct colors for ratings

const EmployeeProgress = () => {
  const [progressData, setProgressData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCourseProgress()
        setProgressData(data)
      } catch (err) {
        console.error('Failed to fetch progress data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const pieData = [
    {
      name: 'Completed',
      value: progressData.filter((entry) => entry.isCompleted).length,
    },
    {
      name: 'In Progress',
      value: progressData.filter((entry) => !entry.isCompleted).length,
    },
  ]

  // Prepare rating distribution data
  const ratingData = [1, 2, 3, 4, 5].map((rating) => ({
    name: `${rating} Stars`,
    value: progressData.filter((entry) => entry.rating?.rating === rating).length,
  }))

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div>
      <ManagerNavbar />
      <div className="p-6 min-h-screen bg-gray-800 text-white">
        <h2 className="text-2xl font-semibold mb-6">Employee Course Progress</h2>

        {/* Section with Two Pie Charts Side by Side */}
        <div className="lg:flex lg:gap-8 mb-6">
          {/* Progress Overview Pie Chart */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full lg:w-1/2 mb-6 lg:mb-0">
            <h3 className="text-xl font-semibold mb-4">Completion Overview</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={80}
                  fill="#8884d8"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_PROGRESS[index % COLORS_PROGRESS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} courses`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Employee Ratings Pie Chart */}
          <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full lg:w-1/2">
            <h3 className="text-xl font-semibold mb-4">Employee Ratings</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={ratingData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  innerRadius={80}
                  fill="#8884d8"
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {ratingData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_RATINGS[index % COLORS_RATINGS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} employees`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm bg-gray-700 rounded-lg overflow-hidden">
            <thead className="bg-gray-600 text-white">
              <tr>
                <th className="p-3 text-left">Course</th>
                <th className="p-3 text-left">Employee</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Progress</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Assessment</th>
                <th className="p-3 text-left">Rating</th>
              </tr>
            </thead>
            <tbody>
              {progressData.map((entry, index) => (
                <tr key={index} className="border-b border-gray-600 hover:bg-gray-600">
                  <td className="p-3">{entry.course.title}</td>
                  <td className="p-3">{entry.employee.Name} ({entry.employee.Designation})</td>
                  <td className="p-3">{entry.employee.email}</td>
                  <td className="p-3">{entry.progress}%</td>
                  <td className={`p-3 ${entry.isCompleted ? 'text-green-500' : 'text-yellow-500'}`}>
                    {entry.isCompleted ? 'Completed' : 'In Progress'}
                  </td>
                  <td className="p-3">
                    {entry.assessment
                      ? `${entry.assessment.score}/${entry.assessment.totalMarks} (${entry.assessment.isPassed ? 'Passed' : 'Failed'})`
                      : 'N/A'}
                  </td>
                  <td className="p-3">
                    {entry.rating
                      ? `${entry.rating.rating}/5 - "${entry.rating.review}"`
                      : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProgress
