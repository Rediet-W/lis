import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PatientSearch = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("card");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);

  const patients = [
    {
      id: 1,
      name: "Abel Teshome",
      cardNumber: "CLN-001",
      phone: "+251 91 234 5678",
      lastVisit: "Oct 25, 2024",
      age: 25,
      gender: "Male",
    },
    {
      id: 2,
      name: "Sara Mohammed",
      cardNumber: "CLN-002",
      phone: "+251 92 345 6789",
      lastVisit: "Oct 24, 2024",
      age: 30,
      gender: "Female",
    },
    {
      id: 3,
      name: "Mikias Haile",
      cardNumber: "CLN-003",
      phone: "+251 93 456 7890",
      lastVisit: "Oct 23, 2024",
      age: 45,
      gender: "Male",
    },
  ];

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  const handleSelectPatient = (patient) => {
    // Navigate to patient details with patient ID
    navigate(`/receptionist/patient-details/${patient.id}`, {
      state: { patient },
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#235F72]">Patient Search</h1>
        <p className="text-gray-600">Find and manage patient records</p>
      </div>

      {/* Search Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Patient
            </label>
            <div className="flex">
              <input
                type="text"
                placeholder={`Enter ${
                  searchType === "card"
                    ? "card number"
                    : searchType === "phone"
                    ? "phone number"
                    : "patient name"
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
              />
              <button className="bg-[#235F72] text-white px-6 py-3 rounded-r-lg hover:bg-[#1a4a5a] transition duration-200">
                Search
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            {["card", "phone", "name"].map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`px-4 py-2 rounded-lg transition duration-200 ${
                  searchType === type
                    ? "bg-[#235F72] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type === "card"
                  ? "Card Number"
                  : type === "phone"
                  ? "Phone"
                  : "Name"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#235F72] mb-4">
            Search Results: "{searchTerm}" - Found {filteredPatients.length}{" "}
            patients
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 text-[#235F72] font-semibold">
                    Name
                  </th>
                  <th className="text-left py-3 text-[#235F72] font-semibold">
                    Card No.
                  </th>
                  <th className="text-left py-3 text-[#235F72] font-semibold">
                    Phone
                  </th>
                  <th className="text-left py-3 text-[#235F72] font-semibold">
                    Last Visit
                  </th>
                  <th className="text-left py-3 text-[#235F72] font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3">{patient.name}</td>
                    <td className="py-3">{patient.cardNumber}</td>
                    <td className="py-3">{patient.phone}</td>
                    <td className="py-3">{patient.lastVisit}</td>
                    <td className="py-3">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="text-[#085DB6] hover:text-[#074a9b] font-medium"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Patient Details */}
      {selectedPatient && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-[#235F72]">
              ✅ Selected: {selectedPatient.name} ({selectedPatient.cardNumber})
            </h3>
            <button
              onClick={() => setSelectedPatient(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
            <div>
              Age: {selectedPatient.age} | Gender: {selectedPatient.gender}
            </div>
            <div>Phone: {selectedPatient.phone}</div>
            <div>Last Test: Oct 25, 2024 - CBC, Glucose</div>
          </div>

          <div className="flex space-x-3">
            <button
              className="bg-[#085DB6] text-white px-4 py-2 rounded-lg hover:bg-[#074a9b] transition duration-200"
              onClick={() => handleSelectPatient(selectedPatient)}
            >
              View History
            </button>
            <button
              className="bg-[#36F1A2] text-[#235F72] px-4 py-2 rounded-lg hover:bg-[#2dd191] transition duration-200"
              onClick={() =>
                navigate("/receptionist/register-patient", {
                  state: { patient: selectedPatient },
                })
              }
            >
              Assign Tests
            </button>
            <button
              className="border border-[#235F72] text-[#235F72] px-4 py-2 rounded-lg hover:bg-[#235F72] hover:text-white transition duration-200"
              onClick={() => handleSelectPatient(selectedPatient)}
            >
              Edit Info
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
