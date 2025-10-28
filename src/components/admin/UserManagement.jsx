import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  getUsers,
  createUser as createUserThunk,
  updateUserThunk,
  toggleUserStatusThunk,
} from "../../store/slices/userSlice";

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [confirmAction, setConfirmAction] = useState(null); // { id, mode: 'activate' | 'deactivate' }
  const [pendingAction, setPendingAction] = useState(false);

  const asBool = (v) => v === true || v === 1 || v === "1";
  const [newUser, setNewUser] = useState({
    full_name: "",
    role: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const roles = [
    {
      value: "admin",
      label: "Administrator",
      description: "Full system access",
    },
    {
      value: "receptionist",
      label: "Receptionist",
      description: "Patient registration and test orders",
    },
    {
      value: "laboratorist",
      label: "Laboratorist",
      description: "Test processing and results entry",
    },
  ];

  const filteredUsers = users.filter((user) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      (user.full_name || "").toLowerCase().includes(q) ||
      (user.email || "").toLowerCase().includes(q) ||
      (user.username || "").toLowerCase().includes(q) ||
      (user.phone || "").toLowerCase().includes(q);
    const matchesRole =
      roleFilter === "all" ||
      (user.role || "").toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  // Convert role for display
  const roleToDisplay = (role) => {
    const roleMap = {
      admin: "Administrator",
      receptionist: "Receptionist",
      laboratorist: "Laboratorist",
    };
    return roleMap[role] || role;
  };

  const handleAddUser = async () => {
    // Validation
    if (
      !newUser.full_name ||
      !newUser.role ||
      !newUser.email ||
      !newUser.username ||
      !newUser.password
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Password strength validation
    if (newUser.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const payload = {
      full_name: newUser.full_name.trim(),
      username: newUser.username.trim(),
      email: newUser.email.trim().toLowerCase(),
      phone: newUser.phone?.trim() || "",
      role: newUser.role,
      password: newUser.password,
      // Backend automatically sets is_active to 1 for new users
    };

    try {
      await dispatch(createUserThunk(payload)).unwrap();
      setShowAddModal(false);
      setNewUser({
        full_name: "",
        role: "",
        email: "",
        username: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
    } catch (e) {
      // Extract a readable message and show it in a toast
      console.error("Failed to create user:", e);

      const formatErrorMessage = (err) => {
        if (err === null || err === undefined)
          return "An unknown error occurred";
        if (typeof err === "string") return err;
        if (Array.isArray(err)) return err.join(", ");
        if (err instanceof Error && err.message) return err.message;
        if (typeof err === "object") {
          // If backend returns an object like { phone: ["Invalid phone number format"] }
          const parts = [];
          Object.values(err).forEach((v) => {
            if (typeof v === "string") parts.push(v);
            else if (Array.isArray(v)) parts.push(v.join(", "));
            else if (typeof v === "object" && v !== null)
              parts.push(JSON.stringify(v));
          });
          if (parts.length) return parts.join(". ");
          return JSON.stringify(err);
        }
        return String(err);
      };

      const message = formatErrorMessage(e);
      toast.error(message);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      // Use the actual backend role value
      role: user.role,
      is_active: asBool(user.is_active),
    });
  };

  const handleUpdateUser = async () => {
    if (
      !editingUser.full_name ||
      !editingUser.role ||
      !editingUser.email ||
      !editingUser.username
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      full_name: editingUser.full_name,
      username: editingUser.username,
      email: editingUser.email,
      phone: editingUser.phone || "",
      role: editingUser.role,
      is_active: asBool(editingUser.is_active) ? 1 : 0,
    };

    try {
      await dispatch(
        updateUserThunk({ id: editingUser.id, data: payload })
      ).unwrap();
      setEditingUser(null);
      dispatch(getUsers());
    } catch (e) {
      // Error is already handled in the thunk with toast
      console.error("Failed to update user:", e);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!confirmAction?.id) return;
    const makeActive = confirmAction.mode === "activate";
    try {
      setPendingAction(true);
      await dispatch(
        toggleUserStatusThunk({ id: confirmAction.id, makeActive })
      ).unwrap();
      await dispatch(getUsers()).unwrap(); // refetch list
      setConfirmAction(null); // close modal
    } catch (e) {
      console.error("Failed to update status:", e);
      setConfirmAction(null); // also close on error
    } finally {
      setPendingAction(false);
    }
  };
  const handleStatusToggle = async (userId) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    const makeActive = !asBool(user.is_active);
    try {
      await dispatch(
        toggleUserStatusThunk({ id: userId, makeActive })
      ).unwrap();
      await dispatch(getUsers());
    } catch (e) {
      // Error is already handled in the thunk with toast
      console.error("Failed to update status:", e);
    }
  };

  const generateUsername = (name) => {
    const base = (name || "").toLowerCase().replace(/\s+/g, "");
    let username = base;
    let counter = 1;
    while (users.find((u) => u.username === username)) {
      username = `${base}${counter++}`;
    }
    return username;
  };

  const handleNameChange = (name) => {
    const username = generateUsername(name);
    setNewUser((prev) => ({ ...prev, full_name: name, username }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format phone for display
  const formatPhone = (phone) => {
    if (!phone) return "N/A";
    return phone;
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
                placeholder="Search users by name, email, username, or phone..."
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
            <option value="admin">Administrator</option>
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
                  User Information
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Contact Info
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Created Date
                </th>
                <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isActive = asBool(user.is_active);
                return (
                  <tr
                    key={user.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-[#235F72]">
                        {user.full_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{user.username}
                      </div>
                      <div className="text-xs text-gray-400">ID: {user.id}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800 border border-purple-200"
                            : user.role === "receptionist"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-green-100 text-green-800 border border-green-200"
                        }`}
                      >
                        {roleToDisplay(user.role)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-600">{user.email}</div>
                      <div className="text-sm text-gray-500">
                        {formatPhone(user.phone)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleStatusToggle(user.id)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${
                          isActive
                            ? "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200"
                            : "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200"
                        }`}
                      >
                        {isActive ? "✅ Active" : "❌ Inactive"}
                      </button>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">
                        {formatDate(user.created_at)}
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
                          onClick={() =>
                            setConfirmAction({
                              id: user.id,
                              mode: isActive ? "deactivate" : "activate",
                            })
                          }
                          className={`font-medium text-sm ${
                            isActive
                              ? "text-red-600 hover:text-red-800"
                              : "text-green-600 hover:text-green-800"
                          }`}
                        >
                          {isActive ? "Deactivate" : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
                      value={newUser.full_name}
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
                      Role *
                    </label>
                    <select
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
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
                      value={editingUser.full_name}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          full_name: e.target.value,
                        })
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
                      value={editingUser.phone || ""}
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

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingUser.is_active}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          is_active: e.target.checked,
                        })
                      }
                      className="mr-2 text-[#36F1A2] focus:ring-[#36F1A2]"
                    />
                    <span className="text-sm text-gray-700">
                      User account is active
                    </span>
                  </label>
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

      {/* Deactivate Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Confirm{" "}
              {confirmAction.mode === "deactivate" ? "Deactivate" : "Activate"}
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to{" "}
              {confirmAction.mode === "deactivate" ? "deactivate" : "activate"}{" "}
              this user? They will{" "}
              {confirmAction.mode === "deactivate" ? "no longer" : "again"} be
              able to access the system.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                disabled={pendingAction}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                className={`px-4 py-2 text-white rounded-lg transition duration-200 ${
                  confirmAction.mode === "deactivate"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={pendingAction}
              >
                {pendingAction
                  ? "Please wait..."
                  : confirmAction.mode === "deactivate"
                  ? "Deactivate User"
                  : "Activate User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
