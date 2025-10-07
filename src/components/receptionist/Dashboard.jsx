import React, { useState } from "react";

const ReceptionistDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = [
    { label: "Today Patients", value: "15", color: "bg-[#36F1A2]" },
    { label: "Pending Tests", value: "08", color: "bg-[#085DB6]" },
    { label: "Results Ready", value: "03", color: "bg-[#235F72]" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
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
