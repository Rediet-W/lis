import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  const getSidebarItems = () => {
    switch (user?.role) {
      case "receptionist":
        return [
          { icon: "📊", label: "Dashboard", id: "dashboard" },
          { icon: "👥", label: "Register Patient", id: "register" },
          { icon: "🔍", label: "Search Patient", id: "search" },
          { icon: "🏥", label: "Test Orders", id: "orders" },
          { icon: "📋", label: "Today Visits", id: "visits" },
        ];
      case "laboratorist":
        return [
          { icon: "🔬", label: "Pending Tests", id: "pending" },
          { icon: "✅", label: "Completed Tests", id: "completed" },
          { icon: "📊", label: "Results History", id: "history" },
        ];
      case "patient":
        return [
          { icon: "📊", label: "Dashboard", id: "dashboard" },
          { icon: "📊", label: "My Results", id: "results" },
          { icon: "👤", label: "My Profile", id: "profile" },
          { icon: "📋", label: "Test History", id: "history" },
        ];
      case "admin":
        return [
          { icon: "📊", label: "Dashboard", id: "dashboard" },
          { icon: "👥", label: "User Management", id: "users" },
          { icon: "🏥", label: "Test Management", id: "tests" },
          { icon: "🏢", label: "Clinic Settings", id: "clinic" },
          { icon: "📊", label: "Activity Logs", id: "activity" },
          { icon: "⚙️", label: "System Settings", id: "system" },
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
            <div className="w-8 h-8 bg-[#36F1A2] rounded-full mr-3"></div>
            <span className="font-bold text-lg">FineCare</span>
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
            onClick={() => setActiveTab(item.id)}
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
