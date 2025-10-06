// components/lab/CompletedTests.jsx
import React, { useState } from "react";

const CompletedTests = () => {
  const [dateRange, setDateRange] = useState("today");

  const completedTests = [
    {
      id: 1,
      date: "Oct 25, 2024",
      patientName: "Abel Teshome",
      tests: ["Complete Blood Count"],
      technician: "Tech01",
      status: "completed",
      actions: ["view", "print", "edit"],
    },
    {
      id: 2,
      date: "Oct 25, 2024",
      patientName: "Sara Mohammed",
      tests: ["Urine Analysis"],
      technician: "Tech02",
      status: "completed",
      actions: ["view", "print", "edit"],
    },
    {
      id: 3,
      date: "Sep 15, 2024",
      patientName: "Mikias Haile",
      tests: ["Malaria Test"],
      technician: "Tech01",
      status: "completed",
      actions: ["view", "print", "edit"],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#235F72]">
          Completed Tests History
        </h1>
        <p className="text-gray-600">
          View and manage completed laboratory tests
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-[#235F72]">Show:</span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateRange === "custom" && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
                <span>to</span>
                <input
                  type="date"
                  className="px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>

          <button className="bg-[#085DB6] text-white px-4 py-2 rounded-lg hover:bg-[#074a9b] transition duration-200">
            Export Results
          </button>
        </div>
      </div>

      {/* Completed Tests Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-[#235F72]">
            Completed Tests History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Patient
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Tests
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Technician
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {completedTests.map((test) => (
                <tr
                  key={test.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-[#235F72]">
                      {test.date}
                    </div>
                    <div className="text-sm text-gray-500">10:30 AM</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium">{test.patientName}</div>
                    <div className="text-sm text-gray-500">CLN-00{test.id}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">{test.tests.join(", ")}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">{test.technician}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button className="text-[#085DB6] hover:text-[#074a9b] font-medium text-sm">
                        View
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-[#36F1A2] hover:text-[#2dd191] font-medium text-sm">
                        Print
                      </button>
                      <span className="text-gray-300">|</span>
                      <button className="text-[#235F72] hover:text-[#1a4a5a] font-medium text-sm">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="text-sm text-gray-600">
            Summary: Showing {completedTests.length} completed tests for
            selected period
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6">
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

export default CompletedTests;
