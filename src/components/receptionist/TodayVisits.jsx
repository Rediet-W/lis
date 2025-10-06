import React, { useState } from "react";

const TodayVisits = () => {
  const [filter, setFilter] = useState("all");

  const todayVisits = [
    {
      id: 1,
      patientName: "Abel Teshome",
      cardNumber: "CLN-001",
      time: "10:15 AM",
      tests: ["CBC", "Blood Glucose"],
      status: "completed",
      priority: "routine",
    },
    {
      id: 2,
      patientName: "Sara Mohammed",
      cardNumber: "CLN-002",
      time: "10:20 AM",
      tests: ["Urine Analysis"],
      status: "in_progress",
      priority: "routine",
    },
    {
      id: 3,
      patientName: "Mikias Haile",
      cardNumber: "CLN-003",
      time: "10:30 AM",
      tests: ["Malaria Test"],
      status: "registered",
      priority: "urgent",
    },
    {
      id: 4,
      patientName: "Helen Girma",
      cardNumber: "CLN-004",
      time: "10:45 AM",
      tests: ["Liver Function Test"],
      status: "registered",
      priority: "routine",
    },
  ];

  const filteredVisits = todayVisits.filter(
    (visit) => filter === "all" || visit.status === filter
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      registered: { color: "bg-blue-100 text-blue-800", label: "Registered" },
      in_progress: {
        color: "bg-orange-100 text-orange-800",
        label: "In Progress",
      },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
    };
    const config = statusConfig[status] || statusConfig.registered;
    return `px-2 py-1 text-xs rounded-full ${config.color}`;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      routine: { color: "bg-gray-100 text-gray-800", label: "Routine" },
      urgent: { color: "bg-orange-100 text-orange-800", label: "Urgent" },
      emergency: { color: "bg-red-100 text-red-800", label: "Emergency" },
    };
    const config = priorityConfig[priority] || priorityConfig.routine;
    return `px-2 py-1 text-xs rounded-full ${config.color}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#235F72]">Today's Visits</h1>
        <p className="text-gray-600">
          Manage patient visits for {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Stats and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-[#235F72]">
            {todayVisits.length}
          </div>
          <div className="text-gray-600 text-sm">Total Visits</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {todayVisits.filter((v) => v.status === "completed").length}
          </div>
          <div className="text-gray-600 text-sm">Completed</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {todayVisits.filter((v) => v.status === "in_progress").length}
          </div>
          <div className="text-gray-600 text-sm">In Progress</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {todayVisits.filter((v) => v.status === "registered").length}
          </div>
          <div className="text-gray-600 text-sm">Registered</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              filter === "all"
                ? "bg-[#235F72] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Visits
          </button>
          <button
            onClick={() => setFilter("registered")}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              filter === "registered"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Registered
          </button>
          <button
            onClick={() => setFilter("in_progress")}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              filter === "in_progress"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              filter === "completed"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Visits Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Patient
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Time
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Tests
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Priority
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
              {filteredVisits.map((visit) => (
                <tr
                  key={visit.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-[#235F72]">
                      {visit.patientName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {visit.cardNumber}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-700">{visit.time}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      {visit.tests.map((test, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1"
                        >
                          {test}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getPriorityBadge(visit.priority)}>
                      {visit.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(visit.status)}>
                      {visit.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button className="text-[#085DB6] hover:text-[#074a9b] text-sm font-medium">
                        View
                      </button>
                      {visit.status === "registered" && (
                        <button className="text-[#36F1A2] hover:text-[#2dd191] text-sm font-medium">
                          Process
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredVisits.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Visits Found
            </h3>
            <p className="text-gray-500">
              No visits match your filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayVisits;
