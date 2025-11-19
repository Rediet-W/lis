import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPatients,
  fetchPatientById,
} from "../../store/slices/patientSlice";

const PatientSearch = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patients, loading, error, currentPatient } = useSelector(
    (state) => state.patients
  );

  const patientList = Array.isArray(patients) ? patients : patients?.data || [];
  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [localSearchResults, setLocalSearchResults] = useState([]);

  // Load all patients on component mount
  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  // Filter patients locally based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setLocalSearchResults([]);
      return;
    }

    const filtered = patientList.filter((patient) => {
      const searchLower = searchTerm.toLowerCase();

      switch (searchType) {
        case "card":
          return patient.card_number?.toLowerCase().includes(searchLower);
        case "phone":
          return patient.phone?.includes(searchTerm);
        case "name":
        default:
          return patient.full_name?.toLowerCase().includes(searchLower);
      }
    });

    setLocalSearchResults(filtered);
  }, [searchTerm, searchType, patients]);

  const handleSelectPatient = async (patient) => {
    try {
      // Fetch full patient details
      const result = await dispatch(fetchPatientById(patient.id)).unwrap();
      setSelectedPatient(result);
    } catch (error) {
      console.error("Failed to fetch patient details:", error);
      // Fallback to basic patient data if detailed fetch fails
      setSelectedPatient(patient);
    }
  };

  const handleAssignTests = (patient) => {
    navigate("/receptionist/test-orders", {
      state: {
        patient: patient,
        from: "patient-search",
      },
    });
  };

  const handleViewHistory = (patient) => {
    navigate(`/receptionist/patient-details/${patient.id}`, {
      state: { patient },
    });
  };

  const handleEditPatient = (patient) => {
    navigate("/receptionist/register-patient", {
      state: {
        patient: patient,
        editMode: true,
      },
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
              <button
                className="bg-[#235F72] text-white px-6 py-3 rounded-r-lg hover:bg-[#1a4a5a] transition duration-200"
                onClick={() => dispatch(fetchPatients())}
              >
                {loading ? "Loading..." : "Refresh"}
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            {["name", "card", "phone"].map((type) => (
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

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#235F72] mb-4">
            Search Results: "{searchTerm}" - Found {localSearchResults.length}{" "}
            patients
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#235F72] mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading patients...</p>
            </div>
          ) : (
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
                      Age
                    </th>
                    <th className="text-left py-3 text-[#235F72] font-semibold">
                      Gender
                    </th>
                    <th className="text-left py-3 text-[#235F72] font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {localSearchResults.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 font-medium">{patient.full_name}</td>
                      <td className="py-3">{patient.card_number}</td>
                      <td className="py-3">{patient.phone}</td>
                      <td className="py-3">{patient.age}</td>
                      <td className="py-3 capitalize">{patient.gender}</td>
                      <td className="py-3">
                        <button
                          onClick={() => handleSelectPatient(patient)}
                          className="text-[#085DB6] hover:text-[#074a9b] font-medium"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {localSearchResults.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No patients found matching your search criteria.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* All Patients List (when no search) */}
      {!searchTerm && patientList.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#235F72] mb-4">
            All Patients ({patientList.length})
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
                    Age
                  </th>
                  <th className="text-left py-3 text-[#235F72] font-semibold">
                    Gender
                  </th>
                  <th className="text-left py-3 text-[#235F72] font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {patientList.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 font-medium">{patient.full_name}</td>
                    <td className="py-3">{patient.card_number}</td>
                    <td className="py-3">{patient.phone}</td>
                    <td className="py-3">{patient.age}</td>
                    <td className="py-3 capitalize">{patient.gender}</td>
                    <td className="py-3">
                      <button
                        onClick={() => handleSelectPatient(patient)}
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
              ✅ Selected: {selectedPatient.full_name} (
              {selectedPatient.card_number})
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
              <strong>Age:</strong> {selectedPatient.age} |{" "}
              <strong>Gender:</strong> {selectedPatient.gender}
            </div>
            <div>
              <strong>Phone:</strong> {selectedPatient.phone}
            </div>
            <div>
              <strong>Email:</strong> {selectedPatient.email || "N/A"}
            </div>
            <div>
              <strong>Blood Type:</strong> {selectedPatient.blood_type || "N/A"}
            </div>
            <div>
              <strong>Address:</strong> {selectedPatient.address || "N/A"}
            </div>
            <div>
              <strong>Emergency Contact:</strong>{" "}
              {selectedPatient.emergency_contact || "N/A"}
            </div>
          </div>

          {/* Medical Information */}
          {(selectedPatient.known_allergies ||
            selectedPatient.chronic_conditions ||
            selectedPatient.current_medications) && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-[#235F72] mb-2">
                Medical Information:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {selectedPatient.known_allergies &&
                  selectedPatient.known_allergies !== "None" && (
                    <div>
                      <strong>Allergies:</strong>{" "}
                      {selectedPatient.known_allergies}
                    </div>
                  )}
                {selectedPatient.chronic_conditions &&
                  selectedPatient.chronic_conditions !== "None" && (
                    <div>
                      <strong>Conditions:</strong>{" "}
                      {selectedPatient.chronic_conditions}
                    </div>
                  )}
                {selectedPatient.current_medications &&
                  selectedPatient.current_medications !== "None" && (
                    <div>
                      <strong>Medications:</strong>{" "}
                      {selectedPatient.current_medications}
                    </div>
                  )}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              className="bg-[#085DB6] text-white px-4 py-2 rounded-lg hover:bg-[#074a9b] transition duration-200"
              onClick={() => handleViewHistory(selectedPatient)}
            >
              View History
            </button>
            <button
              className="bg-[#36F1A2] text-[#235F72] px-4 py-2 rounded-lg hover:bg-[#2dd191] transition duration-200"
              onClick={() => handleAssignTests(selectedPatient)}
            >
              Assign Tests
            </button>
            <button
              className="border border-[#235F72] text-[#235F72] px-4 py-2 rounded-lg hover:bg-[#235F72] hover:text-white transition duration-200"
              onClick={() => handleEditPatient(selectedPatient)}
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
