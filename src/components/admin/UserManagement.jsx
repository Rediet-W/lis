import React, { useState } from "react";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const users = [
    {
      id: 1,
      name: "Admin User",
      role: "Administrator",
      email: "admin@clinic.com",
      status: "active",
      lastLogin: "Today, 10:30 AM",
    },
    {
      id: 2,
      name: "Recep 01",
      role: "Receptionist",
      email: "rec@clinic.com",
      status: "active",
      lastLogin: "Today, 09:15 AM",
    },
    {
      id: 3,
      name: "Lab Tech 01",
      role: "Laboratorist",
      email: "lab@clinic.com",
      status: "active",
      lastLogin: "Today, 08:45 AM",
    },
    {
      id: 4,
      name: "Recep 02",
      role: "Receptionist",
      email: "rec2@clinic.com",
      status: "inactive",
      lastLogin: "Yesterday, 16:20 PM",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <button className="flex items-center text-[#085DB6] hover:text-[#074a9b] mb-2">
              <span className="mr-2">←</span>
              Back
            </button>
            <h1 className="text-2xl font-bold text-[#235F72]">
              User Management
            </h1>
          </div>
          <button className="bg-[#235F72] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold">
            Add New User
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
          >
            <option value="all">Filter by Role: All</option>
            <option value="administrator">Administrator</option>
            <option value="receptionist">Receptionist</option>
            <option value="laboratorist">Laboratorist</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Name
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Email
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
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">
                    <div className="font-medium text-[#235F72]">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Last login: {user.lastLogin}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === "Administrator"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : user.role === "Receptionist"
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-green-100 text-green-800 border border-green-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-600">{user.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      }`}
                    >
                      {user.status === "active" ? "✅ Active" : "❌ Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-[#085DB6] hover:text-[#074a9b] font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Users Found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* More users indicator */}
        {filteredUsers.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="text-center text-gray-500 text-sm">
              ... (more users)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
