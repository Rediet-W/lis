import React, { useState } from "react";

const ActivityLogs = () => {
  const [filters, setFilters] = useState({
    date: "today",
    user: "all",
    action: "all",
    search: "",
  });

  const activityLogs = [
    {
      timestamp: "10:30 AM",
      user: "Lab01",
      action: "Result Entered",
      details: "CBC - Abel T",
    },
    {
      timestamp: "10:25 AM",
      user: "Recep02",
      action: "New Test Ordered",
      details: "Sara M.",
    },
    {
      timestamp: "10:20 AM",
      user: "Lab02",
      action: "Result Finalized",
      details: "Urine - S.M.",
    },
    {
      timestamp: "10:15 AM",
      user: "Recep01",
      action: "Patient Registered",
      details: "Mikias H.",
    },
    {
      timestamp: "10:10 AM",
      user: "Admin",
      action: "User Created",
      details: "Tech03",
    },
    {
      timestamp: "10:05 AM",
      user: "Lab01",
      action: "Test Started",
      details: "Malaria-T.",
    },
    {
      timestamp: "10:00 AM",
      user: "Recep02",
      action: "Patient Updated",
      details: "Helen G.",
    },
    {
      timestamp: "09:55 AM",
      user: "System",
      action: "Backup Completed",
      details: "Automatic",
    },
    {
      timestamp: "09:50 AM",
      user: "Lab02",
      action: "Reference Updated",
      details: "Glucose",
    },
    {
      timestamp: "09:45 AM",
      user: "Recep01",
      action: "Test Cancelled",
      details: "Daniel K.",
    },
  ];

  const logStats = {
    totalLogs: 1248,
    today: 45,
    thisWeek: 320,
    mostActiveUser: "Lab01",
    mostActiveCount: 15,
    peakActivity: "10:00 AM - 11:00 AM",
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <button className="flex items-center text-[#085DB6] hover:text-[#074a9b] mb-2">
              <span className="mr-2">←</span>
              Dashboard
            </button>
            <h1 className="text-2xl font-bold text-[#235F72]">
              System Activity Logs
            </h1>
          </div>
          <button className="bg-[#235F72] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold">
            Export Logs
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <select
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User
            </label>
            <select
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
            >
              <option value="all">All Users</option>
              <option value="admin">Admin</option>
              <option value="receptionist">Receptionist</option>
              <option value="laboratorist">Laboratorist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action
            </label>
            <select
              value={filters.action}
              onChange={(e) =>
                setFilters({ ...filters, action: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
            >
              <option value="all">All Actions</option>
              <option value="login">User Login</option>
              <option value="patient">Patient Registration</option>
              <option value="test">Test Order</option>
              <option value="result">Result Entry</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Keyword search..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button className="bg-[#36F1A2] text-[#235F72] px-6 py-2 rounded-lg hover:bg-[#2dd191] transition duration-200 font-semibold">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Timestamp
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  User
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Action
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map((log, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-[#235F72]">
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        log.user.startsWith("Lab")
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : log.user.startsWith("Recep")
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : log.user === "Admin"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      {log.user}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-700">{log.action}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-600">{log.details}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* More logs indicator */}
        <div className="bg-gray-50 px-6 py-3 border-t">
          <div className="text-center text-gray-500 text-sm">
            ... (more activity logs)
          </div>
        </div>
      </div>

      {/* Log Statistics */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#235F72] mb-4">
          Log Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-[#235F72]">
              {logStats.totalLogs}
            </div>
            <div className="text-gray-600">Total Logs</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-[#235F72]">
              {logStats.today}
            </div>
            <div className="text-gray-600">Today</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-[#235F72]">
              {logStats.thisWeek}
            </div>
            <div className="text-gray-600">This Week</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="font-medium text-[#085DB6]">
              Most Active User:
            </span>{" "}
            {logStats.mostActiveUser} ({logStats.mostActiveCount} actions today)
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="font-medium text-[#235F72]">Peak Activity:</span>{" "}
            {logStats.peakActivity}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200">
          Clear Old Logs
        </button>
        <button className="px-6 py-3 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200">
          Download Report
        </button>
      </div>
    </div>
  );
};

export default ActivityLogs;
