import React, { useState } from "react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const systemStats = [
    { label: "Users", value: "45", color: "bg-[#36F1A2]" },
    { label: "Tests Today", value: "128", color: "bg-[#085DB6]" },
    { label: "Active Sessions", value: "12", color: "bg-[#235F72]" },
  ];

  const recentActivities = [
    { user: "Tech01", action: "Result entered", time: "10:30 AM" },
    { user: "Recep01", action: "New patient", time: "10:15 AM" },
    { user: "Admin", action: "User added", time: "09:45 AM" },
    { user: "Lab02", action: "Test completed", time: "09:30 AM" },
    { user: "Recep02", action: "Report printed", time: "09:15 AM" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        {/* <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#235F72]">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Admin!</span>
              <button className="bg-[#235F72] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200">
                Logout
              </button>
            </div>
          </div>
        </header> */}

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* System Statistics */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-[#235F72] mb-6">
                  System Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {systemStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div
                        className={`w-20 h-20 ${stat.color} rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3`}
                      >
                        {stat.value}
                      </div>
                      <div className="text-lg font-semibold text-[#235F72]">
                        {stat.label}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {stat.label === "Users" && "Total system users"}
                        {stat.label === "Tests Today" &&
                          "Tests processed today"}
                        {stat.label === "Active Sessions" &&
                          "Currently active users"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-[#235F72] mb-4">
                  Recent Activity
                </h2>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-6 text-[#235F72] font-semibold">
                          User
                        </th>
                        <th className="text-left py-3 px-6 text-[#235F72] font-semibold">
                          Action
                        </th>
                        <th className="text-left py-3 px-6 text-[#235F72] font-semibold">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.map((activity, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-6 font-medium">
                            {activity.user}
                          </td>
                          <td className="py-3 px-6 text-gray-600">
                            {activity.action}
                          </td>
                          <td className="py-3 px-6 text-gray-500">
                            {activity.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholder */}
          {activeTab !== "dashboard" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-[#235F72] mb-4">
                {activeTab.charAt(0).toUpperCase() +
                  activeTab.slice(1).replace(/([A-Z])/g, " $1")}
              </h2>
              <p className="text-gray-600">
                This section is under development.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
