// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password, userType) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user data based on role
      const mockUsers = {
        receptionist: {
          id: 1,
          username: "receptionist",
          role: "receptionist",
          name: "Receptionist User",
          email: "receptionist@finecare.com",
        },
        laboratorist: {
          id: 2,
          username: "labtech",
          role: "laboratorist",
          name: "Lab Technician",
          email: "lab@finecare.com",
        },
        admin: {
          id: 3,
          username: "admin",
          role: "admin",
          name: "Administrator",
          email: "admin@finecare.com",
        },
        patient: {
          id: 4,
          username: "patient",
          role: "patient",
          name: "Abel Teshome",
          email: "patient@email.com",
          cardNumber: "CLN-001",
        },
      };

      const userData = mockUsers[userType];
      if (userData && username === userType && password === "password") {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect based on role
        switch (userType) {
          case "receptionist":
            navigate("/receptionist/dashboard");
            break;
          case "laboratorist":
            navigate("/laboratory/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "patient":
            navigate("/patient/dashboard");
            break;
          default:
            navigate("/");
        }

        return { success: true };
      } else {
        return { success: false, error: "Invalid credentials" };
      }
    } catch (error) {
      return { success: false, error: "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
