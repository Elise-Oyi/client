"use client";

import React, { useState } from "react";
import { 
  BarChart, 
  LineChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  DollarSign,
  Download,
  Calendar,
  Filter
} from "lucide-react";
import StatsCard from "@/components/statistics/Card";

const ReportPage = () => {
  const [timeRange, setTimeRange] = useState("12months");
  const [exportFormat, setExportFormat] = useState("pdf");

  const keyMetrics = [
    {
      title: "Total Revenue",
      value: "$45,280",
      icon: <DollarSign size={48} color="#059669" />,
      change: 15.3,
    },
    {
      title: "Active Learners", 
      value: "8,420",
      icon: <Users size={48} color="#0369a1" />,
      change: 8.2,
    },
    {
      title: "Course Completion",
      value: "82.4%",
      icon: <BookOpen size={48} color="#7c3aed" />,
      change: 5.1,
    },
  ];

  const revenueData = [
    { month: "Jan", revenue: 35000, target: 40000 },
    { month: "Feb", revenue: 42000, target: 40000 },
    { month: "Mar", revenue: 38000, target: 42000 },
    { month: "Apr", revenue: 45000, target: 42000 },
    { month: "May", revenue: 52000, target: 45000 },
    { month: "Jun", revenue: 48000, target: 45000 },
    { month: "Jul", revenue: 55000, target: 48000 },
    { month: "Aug", revenue: 58000, target: 48000 },
    { month: "Sep", revenue: 54000, target: 50000 },
    { month: "Oct", revenue: 62000, target: 50000 },
    { month: "Nov", revenue: 59000, target: 52000 },
    { month: "Dec", revenue: 65000, target: 52000 },
  ];

  const enrollmentData = [
    { month: "Jan", enrollments: 320 },
    { month: "Feb", enrollments: 285 },
    { month: "Mar", enrollments: 410 },
    { month: "Apr", enrollments: 389 },
    { month: "May", enrollments: 456 },
    { month: "Jun", enrollments: 392 },
  ];

  const courseData = [
    { name: "Software Engineering", value: 35, color: "#3b82f6" },
    { name: "Cloud Computing", value: 25, color: "#06b6d4" },
    { name: "Data Science", value: 20, color: "#8b5cf6" },
    { name: "UI/UX Design", value: 15, color: "#10b981" },
    { name: "Others", value: 5, color: "#f59e0b" },
  ];

  const handleExport = () => {
    console.log(`Exporting report as ${exportFormat} for ${timeRange}`);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Analytics Report
            </h1>
            <p className="text-gray-600">
              Comprehensive insights into learner performance, revenue trends, and business metrics
            </p>
          </div>
          
          <div className="flex gap-4">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="custom">Custom Range</option>
            </select>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {keyMetrics.map((metric, index) => (
            <StatsCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              change={metric.change}
            />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trends */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Revenue vs Target</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-sky-500 rounded"></div>
                  <span className="text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span className="text-gray-600">Target</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip
                    formatter={(value, name) => [`$${value.toLocaleString()}`, name === 'revenue' ? 'Revenue' : 'Target']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  />
                  <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Course Distribution */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Course Enrollment Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={courseData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  >
                    {courseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Monthly Enrollment Trends */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Monthly Enrollment Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value) => [value, 'Enrollments']}
                  labelStyle={{ color: '#374151' }}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="enrollments" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#0ea5e9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Summary Table */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Track Performance Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Track</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Enrolled</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Completed</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Completion Rate</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Revenue</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Trend</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { track: "Software Engineering", enrolled: 425, completed: 352, rate: 82.8, revenue: 76500, trend: "up" },
                  { track: "Cloud Computing", enrolled: 312, completed: 245, rate: 78.5, revenue: 78000, trend: "up" },
                  { track: "Data Science", enrolled: 289, completed: 231, rate: 79.9, revenue: 289000, trend: "up" },
                  { track: "UI/UX Design", enrolled: 195, completed: 164, rate: 84.1, revenue: 39000, trend: "down" },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium text-gray-800">{row.track}</td>
                    <td className="py-4 px-4 text-gray-600">{row.enrolled}</td>
                    <td className="py-4 px-4 text-gray-600">{row.completed}</td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        row.rate >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {row.rate}%
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-800">${row.revenue.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      {row.trend === "up" ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;