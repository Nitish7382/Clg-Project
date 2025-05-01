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

const COLORS_PROGRESS = ['#14b8a6', '#f97316'] // Teal for Completed, Orange for In Progress

const COLORS_RATINGS = [
  '#ef4444', // 1 Star - Red
  '#f97316', // 2 Stars - Orange
  '#eab308', // 3 Stars - Yellow
  '#22c55e', // 4 Stars - Green
  '#3b82f6', // 5 Stars - Blue
]


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

  const ratingData = [1, 2, 3, 4, 5].map((rating) => ({
    name: `${rating} Stars`,
    value: progressData.filter((entry) => entry.rating?.rating === rating).length,
  }))

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div>
      <ManagerNavbar />
      <div className="p-6 min-h-screen bg-white text-gray-800">
        <h2 className="text-2xl font-semibold mb-6 text-sky-700">Employee Course Progress</h2>

        <div className="lg:flex lg:gap-8 mb-6">
          {/* Completion Pie Chart */}
          <div className="bg-sky-50 border border-sky-200 p-6 rounded-lg shadow w-full lg:w-1/2 mb-6 lg:mb-0">
            <h3 className="text-xl font-semibold text-sky-700 mb-4">Completion Overview</h3>
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

          {/* Ratings Pie Chart */}
          <div className="bg-sky-50 border border-sky-200 p-6 rounded-lg shadow w-full lg:w-1/2">
            <h3 className="text-xl font-semibold text-sky-700 mb-4">Employee Ratings</h3>
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

        {/* Progress Table */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm bg-white border border-sky-200 rounded-lg overflow-hidden">
            <thead className="bg-sky-100 text-sky-800">
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
                <tr key={index} className="border-b border-sky-100 hover:bg-sky-50">
                  <td className="p-3">{entry.course.title}</td>
                  <td className="p-3">{entry.employee.Name} ({entry.employee.Designation})</td>
                  <td className="p-3">{entry.employee.email}</td>
                  <td className="p-3">{entry.progress}%</td>
                  <td className={`p-3 font-medium ${entry.isCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
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
