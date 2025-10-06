// components/receptionist/Dashboard.jsx
import React, { useState } from "react";

const ReceptionistDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    { label: "Today Patients", value: "15", color: "bg-[#36F1A2]" },
    { label: "Pending Tests", value: "08", color: "bg-[#085DB6]" },
    { label: "Results Ready", value: "03", color: "bg-[#235F72]" },
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
            { icon: "👥", label: "Register Patient", id: "register" },
            { icon: "🔍", label: "Search Patient", id: "search" },
            { icon: "🏥", label: "Test Orders", id: "orders" },
            { icon: "📋", label: "Today Visits", id: "visits" },
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
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Receptionist!</span>
              <button className="bg-[#235F72] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200">
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#36F1A2]"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white font-bold text-xl`}
                      >
                        {stat.value}
                      </div>
                      <div className="ml-4">
                        <p className="text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-bold text-[#235F72]">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-[#235F72] mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab("register")}
                    className="bg-[#36F1A2] text-[#235F72] p-4 rounded-lg text-center hover:bg-[#2dd191] transition duration-200 font-semibold"
                  >
                    New Patient
                  </button>
                  <button
                    onClick={() => setActiveTab("search")}
                    className="bg-[#085DB6] text-white p-4 rounded-lg text-center hover:bg-[#074a9b] transition duration-200 font-semibold"
                  >
                    Search Patient
                  </button>
                  <button className="bg-[#235F72] text-white p-4 rounded-lg text-center hover:bg-[#1a4a5a] transition duration-200 font-semibold">
                    Today's Visits
                  </button>
                  <button className="bg-white border-2 border-[#36F1A2] text-[#235F72] p-4 rounded-lg text-center hover:bg-[#36F1A2] transition duration-200 font-semibold">
                    Print Reports
                  </button>
                </div>
              </div>

              {/* Recent Patients */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-[#235F72] mb-4">
                  Recent Patients
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 text-[#235F72]">Name</th>
                        <th className="text-left py-3 text-[#235F72]">
                          Card No.
                        </th>
                        <th className="text-left py-3 text-[#235F72]">Phone</th>
                        <th className="text-left py-3 text-[#235F72]">
                          Last Visit
                        </th>
                        <th className="text-left py-3 text-[#235F72]">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3">Alemayu Teshome</td>
                        <td className="py-3">CLN-001</td>
                        <td className="py-3">0912345678</td>
                        <td className="py-3">Today</td>
                        <td className="py-3">
                          <button className="text-[#085DB6] hover:text-[#074a9b] font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3">Sara Mohammed</td>
                        <td className="py-3">CLN-002</td>
                        <td className="py-3">0923456789</td>
                        <td className="py-3">Today</td>
                        <td className="py-3">
                          <button className="text-[#085DB6] hover:text-[#074a9b] font-medium">
                            View
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would be implemented similarly */}
          {activeTab !== "dashboard" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-[#235F72] mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} -
                Coming Soon
              </h2>
              <p className="text-gray-600">
                This feature is under development.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
