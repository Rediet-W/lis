import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const getSidebarItems = () => {
    switch (user?.role) {
      case "receptionist":
        return [
          {
            icon: "📊",
            label: "Dashboard",
            id: "dashboard",
            path: "/receptionist/dashboard",
          },
          {
            icon: "👥",
            label: "Register Patient",
            id: "register",
            path: "/receptionist/register-patient",
          },
          {
            icon: "🏥",
            label: "Order Tests",
            id: "search",
            path: "/receptionist/search-patient",
          },
          {
            icon: "📦",
            label: "Test Orders",
            id: "orders",
            path: "/receptionist/test-order-list",
          },
          {
            icon: "📋",
            label: "Visits",
            id: "visits",
            path: "/receptionist/visits",
          },
        ];
      case "laboratorist":
        return [
          {
            icon: "📊",
            label: "Dashboard",
            id: "dashboard",
            path: "/laboratory/dashboard",
          },
          {
            icon: "🧪",
            label: "Workbench",
            id: "lab-workbench",
            path: "/laboratory/workbench",
          },
          {
            icon: "📝",
            label: "Enter Results",
            id: "enter-results",
            path: "/laboratory/enter-results",
          },
        ];
      case "patient":
        return [
          {
            icon: "📊",
            label: "Dashboard",
            id: "dashboard",
            path: "/patient/dashboard",
          },
          {
            icon: "👤",
            label: "My Profile",
            id: "profile",
            path: "/patient/profile",
          },
          {
            icon: "📋",
            label: "Test History",
            id: "history",
            path: "/patient/history",
          },
        ];
      case "admin":
        return [
          {
            icon: "📊",
            label: "Dashboard",
            id: "dashboard",
            path: "/admin/dashboard",
          },
          {
            icon: "👥",
            label: "User Management",
            id: "users",
            path: "/admin/users",
          },
          {
            icon: "🏥",
            label: "Test Management",
            id: "tests",
            path: "/admin/tests",
          },
          {
            icon: "🏢",
            label: "Clinic Settings",
            id: "clinic",
            path: "/admin/clinic-settings",
          },
          {
            icon: "📊",
            label: "Activity Logs",
            id: "activity",
            path: "/admin/activity-logs",
          },
        ];
      default:
        return [];
    }
  };

  const sidebarItems = getSidebarItems();

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-[#235F72] text-white transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 flex items-center justify-between">
        {sidebarOpen && (
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="World Laboratory Service Logo"
              className="w-8 h-8 mr-3 rounded-full bg-white object-contain"
            />
            <span className="font-bold text-md">World Laboratory Center</span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:bg-[#1a4a5a] p-1 rounded"
        >
          {sidebarOpen ? "◀" : "▶"}
        </button>
      </div>

      <nav className="mt-8 flex-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              navigate(item.path);
            }}
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

      {sidebarOpen && (
        <div className="p-4 border-t border-[#1a4a5a]">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
