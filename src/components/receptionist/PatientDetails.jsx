import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientDetails = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  const handlePrintReport = (reportId) => {
    // navigate to print page for this report
    navigate(`/print-report`);
  };
  // Mock patient data
  const [patient, setPatient] = useState({
    id: 1,
    cardNumber: "CLN-001",
    fullName: "Abel Teshome",
    phone: "+251 91 234 5678",
    dateOfBirth: "1999-01-15",
    age: 25,
    gender: "Male",
    address: "Bole, Addis Ababa, Ethiopia",
    emergencyContact: "+251 92 345 6789",
    email: "abel.teshome@email.com",
    bloodType: "O+",
    knownAllergies: "None",
    chronicConditions: "None",
    currentMedications: "None",
  });

  const testHistory = [
    {
      id: 1,
      date: "2024-12-15",
      tests: ["Complete Blood Count", "Blood Glucose"],
      totalAmount: 370,
      status: "completed",
      results: "Normal",
      reportId: "RPT-2024-12-15-001",
    },
    {
      id: 2,
      date: "2024-11-20",
      tests: ["Malaria Test"],
      totalAmount: 150,
      status: "completed",
      results: "Negative",
      reportId: "RPT-2024-11-20-001",
    },
    {
      id: 3,
      date: "2024-10-10",
      tests: ["Urine Analysis", "Liver Function Test"],
      totalAmount: 480,
      status: "completed",
      results: "Normal",
      reportId: "RPT-2024-10-10-001",
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <button className="flex items-center text-[#085DB6] hover:text-[#074a9b] mb-2">
              <span className="mr-2">←</span>
              Back to Search
            </button>
            <h1 className="text-2xl font-bold text-[#235F72]">
              Patient Details: {patient.fullName}
            </h1>
            <p className="text-gray-600">Card: {patient.cardNumber}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-[#36F1A2] text-[#235F72] px-6 py-2 rounded-lg hover:bg-[#2dd191] transition duration-200 font-semibold"
            >
              {isEditing ? "Cancel Edit" : "Edit Information"}
            </button>
            {!isEditing && (
              <button className="bg-[#235F72] text-white px-6 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold">
                Assign New Tests
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          {[
            { id: "profile", label: "Profile Information" },
            { id: "history", label: "Test History" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 font-medium transition duration-200 ${
                activeTab === tab.id
                  ? "border-b-2 border-[#235F72] text-[#235F72]"
                  : "text-gray-500 hover:text-[#235F72]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={patient.fullName}
                  onChange={(e) =>
                    setPatient({ ...patient, fullName: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={patient.cardNumber}
                  disabled
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={patient.phone}
                  onChange={(e) =>
                    setPatient({ ...patient, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={patient.dateOfBirth}
                  onChange={(e) =>
                    setPatient({ ...patient, dateOfBirth: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={patient.gender}
                  onChange={(e) =>
                    setPatient({ ...patient, gender: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Type
                </label>
                <select
                  value={patient.bloodType}
                  onChange={(e) =>
                    setPatient({ ...patient, bloodType: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={patient.address}
                  onChange={(e) =>
                    setPatient({ ...patient, address: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Contact
                </label>
                <input
                  type="tel"
                  value={patient.emergencyContact}
                  onChange={(e) =>
                    setPatient({ ...patient, emergencyContact: e.target.value })
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
                  value={patient.email}
                  onChange={(e) =>
                    setPatient({ ...patient, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Known Allergies
                </label>
                <input
                  type="text"
                  value={patient.knownAllergies}
                  onChange={(e) =>
                    setPatient({ ...patient, knownAllergies: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chronic Conditions
                </label>
                <input
                  type="text"
                  value={patient.chronicConditions}
                  onChange={(e) =>
                    setPatient({
                      ...patient,
                      chronicConditions: e.target.value,
                    })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Test History Tab */}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Laboratory Test History
            </h3>

            <div className="space-y-4">
              {testHistory.map((visit) => (
                <div
                  key={visit.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[#36F1A2] transition duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-[#235F72]">
                          {new Date(visit.date).toLocaleDateString()}
                        </h4>
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200">
                          ✅ {visit.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div>
                          <span className="font-medium">Tests:</span>{" "}
                          {visit.tests.join(", ")}
                        </div>
                        <div>
                          <span className="font-medium">Results:</span>{" "}
                          {visit.results}
                        </div>
                        <div>
                          <span className="font-medium">Report ID:</span>{" "}
                          {visit.reportId}
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span> ETB{" "}
                          {visit.totalAmount}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handlePrintReport(visit.reportId)}
                        className="bg-[#085DB6] text-white px-4 py-2 rounded-lg hover:bg-[#074a9b] transition duration-200 text-sm"
                      >
                        Print Report
                      </button>
                      <button className="border border-[#36F1A2] text-[#235F72] px-4 py-2 rounded-lg hover:bg-[#36F1A2] transition duration-200 text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {testHistory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>No test history available.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
