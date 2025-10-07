import React, { useState } from "react";

const ClinicSettings = () => {
  const [clinicInfo, setClinicInfo] = useState({
    name: "FineCare Medical Laboratory",
    address: "Bole Road, Addis Ababa, Ethiopia",
    phone: "+251 91 234 5678",
    email: "info@finecare.com",
    workingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
    aboutText:
      "Professional medical laboratory services with modern technology and expert care.",
    licenseNumber: "MED-LAB-ET-2024-001",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // In real app, save to backend
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#235F72]">Clinic Settings</h1>
        <p className="text-gray-600">Manage clinic information and settings</p>
      </div> */}

      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header with Edit Button */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#235F72]">
              Clinic Information
            </h2>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="bg-[#235F72] text-white px-6 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200"
            >
              {isEditing ? "Save Changes" : "Edit Information"}
            </button>
          </div>
        </div>

        {/* Clinic Information Form */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinic Name
              </label>
              <input
                type="text"
                value={clinicInfo.name}
                onChange={(e) =>
                  setClinicInfo({ ...clinicInfo, name: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <input
                type="text"
                value={clinicInfo.licenseNumber}
                onChange={(e) =>
                  setClinicInfo({
                    ...clinicInfo,
                    licenseNumber: e.target.value,
                  })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={clinicInfo.address}
                onChange={(e) =>
                  setClinicInfo({ ...clinicInfo, address: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={clinicInfo.phone}
                onChange={(e) =>
                  setClinicInfo({ ...clinicInfo, phone: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={clinicInfo.email}
                onChange={(e) =>
                  setClinicInfo({ ...clinicInfo, email: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Working Hours
              </label>
              <input
                type="text"
                value={clinicInfo.workingHours}
                onChange={(e) =>
                  setClinicInfo({ ...clinicInfo, workingHours: e.target.value })
                }
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Clinic
              </label>
              <textarea
                value={clinicInfo.aboutText}
                onChange={(e) =>
                  setClinicInfo({ ...clinicInfo, aboutText: e.target.value })
                }
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Logo Upload Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Clinic Logo
            </h3>
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-sm">Logo</span>
              </div>
              <div>
                <button
                  disabled={!isEditing}
                  className="bg-[#36F1A2] text-[#235F72] px-4 py-2 rounded-lg hover:bg-[#2dd191] transition duration-200 disabled:bg-gray-300 disabled:text-gray-500"
                >
                  Upload New Logo
                </button>
                <p className="text-sm text-gray-500 mt-1">
                  Recommended: 200x200px PNG
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Settings Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-6">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-[#235F72]">
            System Settings
          </h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-700">Auto Backup</div>
              <div className="text-sm text-gray-500">
                Automatically backup data daily
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#36F1A2]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-700">
                Email Notifications
              </div>
              <div className="text-sm text-gray-500">
                Send email alerts for critical results
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#36F1A2]"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-700">Patient Portal</div>
              <div className="text-sm text-gray-500">
                Allow patients to view results online
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#36F1A2]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicSettings;
