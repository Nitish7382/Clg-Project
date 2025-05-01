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
const COLORS_RATINGS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6']

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

  if (loading) return <div className="p-4 text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <ManagerNavbar />
      <div className="p-6">
        <h2 className="text-3xl font-semibold mb-6 text-cyan-400">Employee Course Progress</h2>

        <div className="lg:flex lg:gap-8 mb-6">
          {/* Completion Pie Chart */}
          <div className="bg-[#1e293b] border border-cyan-800 p-6 rounded-lg shadow w-full lg:w-1/2 mb-6 lg:mb-0">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4">Completion Overview</h3>
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
                <Tooltip contentStyle={{ backgroundColor: '#334155', color: 'white' }} formatter={(value) => `${value} courses`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Ratings Pie Chart */}
          <div className="bg-[#1e293b] border border-cyan-800 p-6 rounded-lg shadow w-full lg:w-1/2">
            <h3 className="text-xl font-semibold text-cyan-300 mb-4">Employee Ratings</h3>
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
                    <Cell key={`cell-rating-${index}`} fill={COLORS_RATINGS[index % COLORS_RATINGS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#334155', color: 'white' }} formatter={(value) => `${value} employees`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Table */}
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm bg-[#0f172a] border border-cyan-800 rounded-lg overflow-hidden text-white">
            <thead className="bg-cyan-900 text-cyan-100">
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
                <tr key={index} className="border-b border-cyan-800 hover:bg-cyan-900">
                  <td className="p-3">{entry.course.title}</td>
                  <td className="p-3">{entry.employee.Name} ({entry.employee.Designation})</td>
                  <td className="p-3">{entry.employee.email}</td>
                  <td className="p-3">{entry.progress}%</td>
                  <td className={`p-3 font-medium ${entry.isCompleted ? 'text-green-400' : 'text-yellow-300'}`}>
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
