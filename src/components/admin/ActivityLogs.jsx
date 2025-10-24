import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActivityLogs } from "../../store/slices/activityLogSlice";

const ActivityLogs = () => {
  const dispatch = useDispatch();
  const { logs, loading, error } = useSelector((state) => state.activityLogs);
  // console.log("logs", logs);
  const [filters, setFilters] = useState({
    date: "today",
    user: "all",
    action: "all",
    search: "",
  });

  // Load activity logs when component mounts
  useEffect(() => {
    dispatch(getActivityLogs());
  }, [dispatch]);

  // Filter logs based on current filters
  const filteredLogs =
    logs?.filter((log) => {
      if (filters.date !== "all") {
        // Add date filtering logic here
      }

      // User filter
      if (filters.user !== "all" && log.user_role !== filters.user) {
        return false;
      }

      // Action filter
      if (filters.action !== "all" && !log.action.includes(filters.action)) {
        return false;
      }

      if (
        filters.search &&
        !log.description.toLowerCase().includes(filters.search.toLowerCase()) &&
        !log.user_name.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      return true;
    }) || [];

  // Calculate statistics from the data
  const calculateStats = () => {
    if (!logs) return null;

    const today = new Date().toDateString();
    const todayLogs = logs.filter(
      (log) => new Date(log.created_at).toDateString() === today
    );

    const userActivity = {};
    logs.forEach((log) => {
      userActivity[log.user_name] = (userActivity[log.user_name] || 0) + 1;
    });

    const mostActiveUser = Object.keys(userActivity).reduce(
      (a, b) => (userActivity[a] > userActivity[b] ? a : b),
      ""
    );

    // Calculate hourly activity
    const hourlyActivity = {};
    logs.forEach((log) => {
      const hour = new Date(log.created_at).getHours();
      hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
    });

    const peakHour = Object.keys(hourlyActivity).reduce(
      (a, b) => (hourlyActivity[a] > hourlyActivity[b] ? a : b),
      ""
    );
    const peakActivity = `${peakHour}:00 - ${parseInt(peakHour) + 1}:00`;

    return {
      totalLogs: logs.length,
      today: todayLogs.length,
      thisWeek: logs.filter((log) => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(log.created_at) >= oneWeekAgo;
      }).length,
      mostActiveUser,
      mostActiveCount: userActivity[mostActiveUser] || 0,
      peakActivity,
    };
  };

  const logStats = calculateStats() || {
    totalLogs: 0,
    today: 0,
    thisWeek: 0,
    mostActiveUser: "N/A",
    mostActiveCount: 0,
    peakActivity: "N/A",
  };

  // Format date for display
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

  // Get action icon and color based on action type
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

  // Get user role color
  const getUserRoleColor = (role) => {
    const roleColors = {
      admin: "bg-red-100 text-red-800 border-red-200",
      receptionist: "bg-blue-100 text-blue-800 border-blue-200",
      laboratorist: "bg-green-100 text-green-800 border-green-200",
      patient: "bg-purple-100 text-purple-800 border-purple-200",
      default: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return roleColors[role] || roleColors.default;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#235F72]"></div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Loading Activity Logs
              </h3>
              <p className="text-gray-500 mt-1">
                Fetching system activity data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            {/* <h1 className="text-2xl font-bold text-[#235F72]">
              System Activity Logs
            </h1> */}
            <p className="text-gray-600 mt-1">
              Monitor all system activities and user actions
            </p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
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
              <option value="all">All Time</option>
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Role
            </label>
            <select
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="receptionist">Receptionist</option>
              <option value="laboratorist">Laboratorist</option>
              <option value="patient">Patient</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Type
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
              <option value="register">User Registration</option>
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
                placeholder="Search users, actions, descriptions..."
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

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">
            Showing {filteredLogs.length} of {logs?.length || 0} logs
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() =>
                setFilters({
                  date: "all",
                  user: "all",
                  action: "all",
                  search: "",
                })
              }
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              Clear Filters
            </button>
            <button
              onClick={() => dispatch(getActivityLogs())}
              className="bg-[#36F1A2] text-[#235F72] px-6 py-2 rounded-lg hover:bg-[#2dd191] transition duration-200 font-semibold"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Date & Time
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  User
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Action
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const actionInfo = getActionInfo(log.action);
                  return (
                    <tr
                      key={log.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition duration-150"
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-[#235F72] text-sm">
                          {formatDate(log.created_at)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">
                            {log.user_name}
                          </div>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUserRoleColor(
                              log.user_role
                            )}`}
                          >
                            {log.user_role}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${actionInfo.color}`}
                        >
                          <span className="mr-2">{actionInfo.icon}</span>
                          {actionInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-700 max-w-md">
                          {log.description}
                        </div>
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
                    No activity logs found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Load more indicator */}
        {filteredLogs.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t">
            <div className="text-center text-gray-500 text-sm">
              Showing latest {filteredLogs.length} activities
            </div>
          </div>
        )}
      </div>

      {/* Log Statistics */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#235F72] mb-4">
          Activity Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-[#235F72]">
              {logStats.totalLogs}
            </div>
            <div className="text-gray-600">Total Logs</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-[#235F72]">
              {logStats.today}
            </div>
            <div className="text-gray-600">Today</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-[#235F72]">
              {logStats.thisWeek}
            </div>
            <div className="text-gray-600">This Week</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <span className="font-medium text-[#085DB6]">
              Most Active User:
            </span>{" "}
            {logStats.mostActiveUser} ({logStats.mostActiveCount} actions)
          </div>
          <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
            <span className="font-medium text-[#235F72]">Peak Activity:</span>{" "}
            {logStats.peakActivity}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {/* <div className="flex justify-end space-x-4">
        <button className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200">
          Export Logs
        </button>
        <button className="px-6 py-3 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200">
          Download Report
        </button>
      </div> */}
    </div>
  );
};

export default ActivityLogs;
