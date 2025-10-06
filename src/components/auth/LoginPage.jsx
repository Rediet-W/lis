// src/components/auth/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("receptionist");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(username, password, userType);

    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#235F72] to-[#085DB6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#235F72] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-10 h-10 bg-[#36F1A2] rounded-full"></div>
          </div>
          <h1 className="text-3xl font-bold text-[#085DB6]">FineCare</h1>
          <p className="text-gray-600 mt-2">Laboratory Information System</p>
        </div>

        {/* User Type Selection */}
        <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
          {["receptionist", "laboratorist", "admin"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setUserType(type)}
              className={`py-2 px-3 rounded-md text-sm font-medium capitalize transition duration-200 ${
                userType === type
                  ? "bg-[#235F72] text-white shadow"
                  : "text-gray-600 hover:text-[#235F72]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent outline-none transition duration-200"
              placeholder={`Enter ${userType} username`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent outline-none transition duration-200"
              placeholder="Enter password"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Demo: Use '{userType}' as username and 'password' as password
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-200 shadow-md ${
              loading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#235F72] text-white hover:bg-[#1a4a5a]"
            }`}
          >
            {loading
              ? "Signing In..."
              : `Sign In as ${
                  userType.charAt(0).toUpperCase() + userType.slice(1)
                }`}
          </button>
        </form>

        {/* Patient Login Option */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => setUserType("patient")}
            className="w-full border-2 border-[#36F1A2] text-[#235F72] py-3 rounded-lg font-semibold hover:bg-[#36F1A2] transition duration-200"
          >
            Patient Portal Login
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">
            Patients: Use your card number and phone number
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-[#085DB6] hover:text-[#074a9b] text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
