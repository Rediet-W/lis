// components/patient/Dashboard.jsx
import React, { useState } from "react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const recentTests = [
    {
      id: 1,
      date: "Oct 25, 2024",
      tests: "Complete Blood Count",
      status: "completed",
    },
    {
      id: 2,
      date: "Sep 15, 2024",
      tests: "Blood Glucose",
      status: "completed",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-[#235F72] text-white transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#36F1A2] rounded-full mr-3"></div>
              <span className="font-bold text-lg">FineCare</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="mt-8">
          {[
            { icon: "📊", label: "Dashboard", id: "dashboard" },
            { icon: "📊", label: "My Results", id: "results" },
            { icon: "👤", label: "My Profile", id: "profile" },
            { icon: "📋", label: "Test History", id: "history" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left transition duration-200 ${
                activeTab === item.id
                  ? "bg-[#36F1A2] text-[#235F72]"
                  : "hover:bg-[#1a4a5a]"
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#235F72]">
              Patient Portal
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Abel!</span>
              <button className="bg-[#235F72] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200">
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-[#235F72] mb-4">
                  Personal Information
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">Name:</span>
                    <span className="text-[#235F72]">Abel Teshome</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">Card No:</span>
                    <span className="text-[#235F72]">CLN-001</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium text-gray-600">Phone:</span>
                    <span className="text-[#235F72]">+251 91 234 5678</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      Age | Gender:
                    </span>
                    <span className="text-[#235F72]">25 | Male</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Test Results */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-[#235F72] mb-4">
                  Recent Test Results
                </h2>
                <div className="space-y-4">
                  {recentTests.map((test) => (
                    <div
                      key={test.id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#36F1A2] transition duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-[#235F72]">
                              Date: {test.date}
                            </h3>
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200">
                              ✅ {test.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">
                            Tests: {test.tests}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button className="bg-[#085DB6] text-white px-4 py-2 rounded-lg hover:bg-[#074a9b] transition duration-200 text-sm">
                            View Report
                          </button>
                          <button className="border border-[#36F1A2] text-[#235F72] px-4 py-2 rounded-lg hover:bg-[#36F1A2] transition duration-200 text-sm">
                            Print
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {recentTests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No test results available.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
