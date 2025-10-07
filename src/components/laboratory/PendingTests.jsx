import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PendingTests = () => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const pendingTests = [
    {
      id: 1,
      patientName: "Alemayu Teshome",
      cardNumber: "CLN-001",
      age: 25,
      gender: "male",
      tests: ["CBC", "Blood Glucose"],
      collectedTime: "10:15 AM",
      priority: "high",
      status: "sample_collected",
    },
    {
      id: 2,
      patientName: "Sara Mohammed",
      cardNumber: "CLN-002",
      age: 30,
      gender: "female",
      tests: ["Urine Analysis", "Pregnancy Test"],
      collectedTime: "10:20 AM",
      priority: "normal",
      status: "sample_collected",
      dynamicQuestions: { pregnant: "Yes" },
    },
    {
      id: 3,
      patientName: "Mikias Haile",
      cardNumber: "CLN-003",
      age: 45,
      gender: "male",
      tests: ["Malaria Test"],
      collectedTime: "09:45 AM",
      priority: "normal",
      status: "sample_collected",
    },
  ];

  const filteredTests = pendingTests.filter((test) => {
    const matchesSearch =
      test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.cardNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || test.priority === filter;
    return matchesSearch && matchesFilter;
  });

  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-orange-100 text-orange-800 border-orange-200",
      critical: "bg-red-100 text-red-800 border-red-200",
      normal: "bg-green-100 text-green-800 border-green-200",
    };
    return `px-2 py-1 text-xs rounded-full border ${styles[priority]}`;
  };
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#235F72]">
          Pending Tests Queue
        </h1>
        <p className="text-gray-600">Manage and process laboratory tests</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                filter === "all"
                  ? "bg-[#235F72] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Tests
            </button>
            <button
              onClick={() => setFilter("critical")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                filter === "critical"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Critical
            </button>
            <button
              onClick={() => setFilter("high")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                filter === "high"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              High Priority
            </button>
            <button
              onClick={() => setFilter("normal")}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                filter === "normal"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Normal
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search patient or card..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>
      </div>

      {/* Pending Tests List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[#235F72]">
              Pending Tests ({filteredTests.length})
            </h2>
            <div className="text-sm text-gray-500">
              Sorted by: Priority & Time
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="p-6 hover:bg-gray-50 transition duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-[#235F72] text-lg">
                      {test.patientName}
                    </h3>
                    <span className={getPriorityBadge(test.priority)}>
                      {test.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Card:</span>{" "}
                      {test.cardNumber}
                    </div>
                    <div>
                      <span className="font-medium">Age/Gender:</span>{" "}
                      {test.age} / {test.gender}
                    </div>
                    <div>
                      <span className="font-medium">Collected:</span>{" "}
                      {test.collectedTime}
                    </div>
                    <div>
                      <span className="font-medium">Tests:</span>{" "}
                      {test.tests.join(", ")}
                    </div>
                  </div>

                  {/* Dynamic Questions Info */}
                  {test.dynamicQuestions && (
                    <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200 text-sm">
                      <span className="font-medium text-[#085DB6]">
                        Additional Info:
                      </span>{" "}
                      {Object.entries(test.dynamicQuestions).map(
                        ([key, value]) => (
                          <span key={key} className="ml-2">
                            {key}: {value}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  <button
                    className="bg-[#235F72] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-medium"
                    onClick={() => navigate("/laboratory/enter-results")}
                  >
                    Enter Results
                  </button>
                  <button className="border border-[#085DB6] text-[#085DB6] px-4 py-2 rounded-lg hover:bg-[#085DB6] hover:text-white transition duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Pending Tests
            </h3>
            <p className="text-gray-500">All tests have been processed!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingTests;
