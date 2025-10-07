import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TestHistory = () => {
  const [filters, setFilters] = useState({
    dateRange: "",
    testType: "all",
    status: "all",
  });

  const testHistory = [
    {
      id: 1,
      date: "Oct 25, 2024",
      testType: "Complete Blood Count",
      status: "completed",
      results: "Normal",
    },
    {
      id: 2,
      date: "Oct 25, 2024",
      testType: "Blood Glucose",
      status: "completed",
      results: "Normal",
    },
    {
      id: 3,
      date: "Sep 15, 2024",
      testType: "Urine Analysis",
      status: "completed",
      results: "Normal",
    },
    {
      id: 4,
      date: "Aug 10, 2024",
      testType: "Liver Function Test",
      status: "completed",
      results: "Normal",
    },
    {
      id: 5,
      date: "Jul 05, 2024",
      testType: "Malaria Test",
      status: "completed",
      results: "Negative",
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <button className="flex items-center text-[#085DB6] hover:text-[#074a9b] mb-4">
          <span className="mr-2">←</span>
          Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-[#235F72]">Test History</h1>
        <p className="text-gray-600">
          View your laboratory test results history
        </p>
      </div>

      {/* Filter Options */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Date Range */}
          <div className="min-w-0 ">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <input
                type="date"
                className=" px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
              />
              <span className="self-center text-center">to</span>
              <input
                type="date"
                className=" px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
              />
            </div>
          </div>

          {/* Test Type */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Type
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent">
              <option value="all">All Tests</option>
              <option value="cbc">Complete Blood Count</option>
              <option value="glucose">Blood Glucose</option>
              <option value="urine">Urine Analysis</option>
            </select>
          </div>

          {/* Status */}
          <div className="min-w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent">
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Apply Filters Button */}
          <div className="flex items-end min-w-0">
            <button className="w-full bg-[#235F72] text-white py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Test History Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Test Type
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {testHistory.map((test) => (
                <tr
                  key={test.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-[#235F72]">
                      {test.date}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium">{test.testType}</div>
                    <div className="text-sm text-gray-500">
                      Results: {test.results}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                      ✅ {test.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      className="text-[#085DB6] hover:text-[#074a9b] font-medium"
                      onClick={() => navigate("/print-report")}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">Showing 5 of 15 results</div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
                2
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
                3
              </button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100">
                Next `&gt;`
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestHistory;
