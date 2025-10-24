import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActivityLogs } from "../../store/slices/activityLogSlice";
import {useNavigate} from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { logs, loading, error } = useSelector((state) => state.activityLogs);

  useEffect(() => {
    dispatch(getActivityLogs());
  }, [dispatch]);

  // Enhanced system stats with more relevant metrics
  const systemStats = [
    {
      label: "Total Users",
      value: "45",
      color: "bg-[#36F1A2]",
      icon: "👥",
      description: "Registered system users",
      trend: "+5 this month",
    },
    {
      label: "Total Tests",
      value: "1,284",
      color: "bg-[#085DB6]",
      icon: "🧪",
      description: "Tests in system",
      trend: "+12% growth",
    },
    {
      label: "Today's Tests",
      value: "128",
      color: "bg-[#235F72]",
      icon: "📊",
      description: "Tests processed today",
      trend: "On track",
    },
    {
      label: "Pending Results",
      value: "24",
      color: "bg-[#FF6B6B]",
      icon: "⏳",
      description: "Awaiting results",
      trend: "4 urgent",
    },
  ];

  // Test status data for progress visualization
  const testStatusData = [
    { status: "Completed", count: 104, color: "bg-green-500", percent: 65 },
    { status: "In Progress", count: 32, color: "bg-blue-500", percent: 20 },
    { status: "Pending", count: 24, color: "bg-yellow-500", percent: 15 },
  ];

  // Quick actions for the dashboard
  const quickActions = [
    { icon: "🧪", label: "New Test", action: () => navigate('/admin/tests') },
    {
      icon: "👤",
      label: "Add Users",
      action: () => navigate("/admin/users"),
    },
    {
      icon: "📊",
      label: "View Reports",
      action: () => navigate("/admin/activity-logs"),
    },
    { icon: "⚙️", label: "Clinic Settings", action: () => navigate("/admin/clinic-settings") },
  ];

  // Helpers similar to ActivityLogs
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActionInfo = (action) => {
    const actionMap = {
      login: {
        icon: "🔐",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        label: "User Login",
      },
      register: {
        icon: "👤",
        color: "bg-green-100 text-green-800 border-green-200",
        label: "User Registration",
      },
      patient_registered: {
        icon: "📝",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        label: "Patient Registered",
      },
      test_ordered: {
        icon: "🧪",
        color: "bg-orange-100 text-orange-800 border-orange-200",
        label: "Test Ordered",
      },
      result_entered: {
        icon: "📊",
        color: "bg-teal-100 text-teal-800 border-teal-200",
        label: "Result Entered",
      },
      default: {
        icon: "📋",
        color: "bg-gray-100 text-gray-800 border-gray-200",
        label: action,
      },
    };
    return actionMap[action] || actionMap.default;
  };

  const recentLogs = (logs || [])
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Enhanced System Statistics */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-[#235F72] mb-6">
                  System Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {systemStats.map((stat, index) => (
                    <div
                      key={index}
                      className="relative p-6 rounded-lg border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white"
                    >
                      {/* Background pattern */}
                      <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                        <div className="text-4xl">{stat.icon}</div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`p-3 rounded-full ${stat.color} bg-opacity-10`}
                        >
                          <span className="text-2xl">{stat.icon}</span>
                        </div>
                        {stat.trend && (
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              stat.trend.includes("+")
                                ? "bg-green-100 text-green-800"
                                : stat.trend.includes("urgent")
                                ? "bg-red-100 text-red-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {stat.trend}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="text-3xl font-bold text-[#235F72]">
                          {stat.value}
                        </div>
                        <div className="text-lg font-semibold text-gray-700">
                          {stat.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {stat.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions and Test Status Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1">
                  <h3 className="text-lg font-semibold text-[#235F72] mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200 text-center group hover:border-[#235F72]"
                      >
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                          {action.icon}
                        </div>
                        <div className="text-sm font-medium text-gray-700 group-hover:text-[#235F72]">
                          {action.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Test Status Overview */}
                <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-[#235F72] mb-4">
                    Test Status Overview
                  </h3>
                  <div className="space-y-4">
                    {testStatusData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">
                            {item.status}
                          </span>
                          <span className="text-gray-600">
                            {item.count} tests ({item.percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`${item.color} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${item.percent}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Total Tests Today: 160</span>
                      <span className="font-semibold text-[#235F72]">
                        81% Completion Rate
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[#235F72]">
                    Recent Activity
                  </h2>
                  <button
                    onClick={() => dispatch(getActivityLogs())}
                    className="text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 text-[#235F72] font-medium"
                  >
                    Refresh
                  </button>
                </div>

                {loading ? (
                  <div className="py-8 text-center text-gray-600">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#235F72]"></div>
                    <div className="mt-2">Loading recent activity...</div>
                  </div>
                ) : error ? (
                  <div className="py-4 text-red-600 text-center">
                    {String(error) || "Failed to load activity"}
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left py-3 px-6 text-[#235F72] font-semibold">
                            Date & Time
                          </th>
                          <th className="text-left py-3 px-6 text-[#235F72] font-semibold">
                            User
                          </th>
                          <th className="text-left py-3 px-6 text-[#235F72] font-semibold">
                            Action
                          </th>
                          <th className="text-left py-3 px-6 text-[#235F72] font-semibold">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentLogs.length > 0 ? (
                          recentLogs.map((log) => {
                            const actionInfo = getActionInfo(log.action);
                            return (
                              <tr
                                key={log.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
                              >
                                <td className="py-3 px-6 text-sm text-[#235F72] font-medium">
                                  {formatDate(log.created_at)}
                                </td>
                                <td className="py-3 px-6">
                                  <div className="font-medium text-gray-900">
                                    {log.user_name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {log.user_role}
                                  </div>
                                </td>
                                <td className="py-3 px-6">
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${actionInfo.color} border`}
                                  >
                                    <span className="mr-2">
                                      {actionInfo.icon}
                                    </span>
                                    {actionInfo.label}
                                  </span>
                                </td>
                                <td className="py-3 px-6 text-gray-700">
                                  {log.description}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="py-8 px-6 text-center text-gray-500"
                            >
                              <div className="text-4xl mb-2">📋</div>
                              No recent activities found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {recentLogs.length > 0 && (
                      <div className="bg-gray-50 px-6 py-3 border-t text-sm text-gray-500 flex justify-between items-center">
                        <span>
                          Showing latest {recentLogs.length} activities
                        </span>
                        <button
                          onClick={() => dispatch(getActivityLogs())}
                          className="text-[#235F72] hover:text-[#1a4a5a] font-medium"
                        >
                          View All Activity
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
