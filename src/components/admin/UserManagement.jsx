import React, { useState } from "react";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Initial users data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Admin User",
      role: "Administrator",
      email: "admin@clinic.com",
      username: "admin",
      phone: "+251 91 111 1111",
      status: "active",
      lastLogin: "Today, 10:30 AM",
      department: "Administration",
      createdDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Recep 01",
      role: "Receptionist",
      email: "rec@clinic.com",
      username: "receptionist1",
      phone: "+251 92 222 2222",
      status: "active",
      lastLogin: "Today, 09:15 AM",
      department: "Reception",
      createdDate: "2024-02-20",
    },
    {
      id: 3,
      name: "Lab Tech 01",
      role: "Laboratorist",
      email: "lab@clinic.com",
      username: "labtech1",
      phone: "+251 93 333 3333",
      status: "active",
      lastLogin: "Today, 08:45 AM",
      department: "Laboratory",
      createdDate: "2024-03-10",
    },
    {
      id: 4,
      name: "Recep 02",
      role: "Receptionist",
      email: "rec2@clinic.com",
      username: "receptionist2",
      phone: "+251 94 444 4444",
      status: "inactive",
      lastLogin: "Yesterday, 16:20 PM",
      department: "Reception",
      createdDate: "2024-04-05",
    },
  ]);

  const [newUser, setNewUser] = useState({
    name: "",
    role: "",
    email: "",
    username: "",
    phone: "",
    department: "",
    status: "active",
    password: "",
    confirmPassword: "",
  });

  const roles = [
    {
      value: "Administrator",
      label: "Administrator",
      description: "Full system access",
    },
    {
      value: "Receptionist",
      label: "Receptionist",
      description: "Patient registration and test orders",
    },
    {
      value: "Laboratorist",
      label: "Laboratorist",
      description: "Test processing and results entry",
    },
  ];

  const departments = [
    "Administration",
    "Reception",
    "Laboratory",
    "Billing",
    "Quality Control",
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "all" ||
      user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const handleAddUser = () => {
    // Validation
    if (
      !newUser.name ||
      !newUser.role ||
      !newUser.email ||
      !newUser.username ||
      !newUser.password
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (users.find((user) => user.email === newUser.email)) {
      alert("A user with this email already exists");
      return;
    }

    if (users.find((user) => user.username === newUser.username)) {
      alert("A user with this username already exists");
      return;
    }

    const userToAdd = {
      ...newUser,
      id: users.length + 1,
      lastLogin: "Never",
      createdDate: new Date().toISOString().split("T")[0],
    };

    // Remove password fields before storing
    const { password, confirmPassword, ...userWithoutPassword } = userToAdd;

    setUsers([...users, userWithoutPassword]);
    setNewUser({
      name: "",
      role: "",
      email: "",
      username: "",
      phone: "",
      department: "",
      status: "active",
      password: "",
      confirmPassword: "",
    });
    setShowAddModal(false);
  };

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
  };

  const handleUpdateUser = () => {
    if (
      !editingUser.name ||
      !editingUser.role ||
      !editingUser.email ||
      !editingUser.username
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Check for duplicate email (excluding current user)
    const duplicateEmail = users.find(
      (user) => user.email === editingUser.email && user.id !== editingUser.id
    );
    if (duplicateEmail) {
      alert("A user with this email already exists");
      return;
    }

    // Check for duplicate username (excluding current user)
    const duplicateUsername = users.find(
      (user) =>
        user.username === editingUser.username && user.id !== editingUser.id
    );
    if (duplicateUsername) {
      alert("A user with this username already exists");
      return;
    }

    setUsers(
      users.map((user) => (user.id === editingUser.id ? editingUser : user))
    );
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
    setShowDeleteConfirm(null);
  };

  const handleStatusToggle = (userId) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
  };

  const generateUsername = (name) => {
    const baseUsername = name.toLowerCase().replace(/\s+/g, "");
    let username = baseUsername;
    let counter = 1;

    while (users.find((user) => user.username === username)) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    return username;
  };

  const handleNameChange = (name) => {
    const username = generateUsername(name);
    setNewUser((prev) => ({
      ...prev,
      name,
      username,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#235F72]">
              User Management
            </h1>
            <p className="text-gray-600">Manage system users and permissions</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#235F72] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold"
          >
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
                placeholder="Search users by name, email, or username..."
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
            <option value="all">All Roles</option>
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
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  User
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Contact
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Department
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Last Login
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Actions
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
                      @{user.username}
                    </div>
                    <div className="text-xs text-gray-400">
                      Created: {user.createdDate}
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
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-600">{user.department}</div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleStatusToggle(user.id)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                          : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
                      }`}
                    >
                      {user.status === "active" ? "✅ Active" : "❌ Inactive"}
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600">
                      {user.lastLogin}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-[#085DB6] hover:text-[#074a9b] font-medium text-sm"
                      >
                        Edit
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => setShowDeleteConfirm(user.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
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
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#235F72]">
                  Add New User
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) =>
                        setNewUser({ ...newUser, username: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="Username will be auto-generated"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="user@clinic.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newUser.phone}
                      onChange={(e) =>
                        setNewUser({ ...newUser, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="+251 91 234 5678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={newUser.department}
                      onChange={(e) =>
                        setNewUser({ ...newUser, department: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <div className="space-y-2">
                    {roles.map((role) => (
                      <label
                        key={role.value}
                        className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role.value}
                          checked={newUser.role === role.value}
                          onChange={(e) =>
                            setNewUser({ ...newUser, role: e.target.value })
                          }
                          className="mt-1 text-[#36F1A2] focus:ring-[#36F1A2]"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {role.label}
                          </div>
                          <div className="text-sm text-gray-500">
                            {role.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="Enter password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={newUser.confirmPassword}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="Confirm password"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newUser.status === "active"}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          status: e.target.checked ? "active" : "inactive",
                        })
                      }
                      className="mr-2 text-[#36F1A2] focus:ring-[#36F1A2]"
                    />
                    <span className="text-sm text-gray-700">
                      Activate user account immediately
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-6 py-3 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold"
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#235F72]">Edit User</h2>
                <button
                  onClick={() => setEditingUser(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={editingUser.name}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={editingUser.username}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          username: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editingUser.phone}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      value={editingUser.department}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          department: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="px-6 py-3 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold"
                >
                  Update User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
