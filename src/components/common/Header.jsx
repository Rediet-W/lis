import React from "react";
import { useAuth } from "../../contexts/AuthContext";

const Header = ({ title, onToggleSidebar }) => {
  const { user } = useAuth();

  const getRoleDisplayName = (role) => {
    const roleNames = {
      receptionist: "Receptionist",
      laboratorist: "Lab Technician",
      admin: "Administrator",
      patient: "Patient",
    };
    return roleNames[role] || role;
  };

  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="mr-4 text-gray-600 hover:text-[#235F72] lg:hidden"
          >
            ☰
          </button>
          <h1 className="text-2xl font-bold text-[#235F72]">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">Welcome, {user?.name}!</span>
          <span className="bg-[#36F1A2] text-[#235F72] px-3 py-1 rounded-full text-sm font-medium">
            {getRoleDisplayName(user?.role)}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
