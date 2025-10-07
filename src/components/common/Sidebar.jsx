import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
            icon: "🔍",
            label: "Search Patient",
            id: "search",
            path: "/receptionist/search-patient",
          },
          {
            icon: "🏥",
            label: "Test Orders",
            id: "orders",
            path: "/receptionist/test-orders",
          },
          // {
          //   icon: "📋",
          //   label: "Today Visits",
          //   id: "visits",
          //   path: "/receptionist/today-visits",
          // },
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
            icon: "🔬",
            label: "Pending Tests",
            id: "pending",
            path: "/laboratory/pending-tests",
          },
          {
            icon: "✅",
            label: "Completed Tests",
            id: "completed",
            path: "/laboratory/completed-tests",
          },
          // {
          //   icon: "📊",
          //   label: "Results History",
          //   id: "history",
          //   path: "/laboratory/results-history",
          // },
        ];
      case "patient":
        return [
          {
            icon: "📊",
            label: "Dashboard",
            id: "dashboard",
            path: "/patient/dashboard",
          },
          // {
          //   icon: "📊",
          //   label: "My Results",
          //   id: "results",
          //   path: "/patient/results",
          // },
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
          // {
          //   icon: "⚙️",
          //   label: "System Settings",
          //   id: "system",
          //   path: "/admin/system-settings",
          // },
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
              // setActiveTab(item.id);
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
            onClick={logout}
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
