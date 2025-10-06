// components/receptionist/PatientRegistration.jsx
import React, { useState } from "react";

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    emergencyContact: "",
  });

  const [selectedTests, setSelectedTests] = useState([]);
  const [cardNumber, setCardNumber] = useState(
    "CLN-" + Math.floor(1000 + Math.random() * 9000)
  );

  const availableTests = [
    { id: 1, name: "Complete Blood Count (CBC)", category: "Hematology" },
    { id: 2, name: "Blood Glucose (Fasting)", category: "Diabetes" },
    { id: 3, name: "Blood Glucose (Random)", category: "Diabetes" },
    { id: 4, name: "Malaria Test", category: "Infectious" },
    { id: 5, name: "Typhoid Test", category: "Infectious" },
    { id: 6, name: "HIV Test", category: "Infectious" },
    { id: 7, name: "Urine Analysis", category: "Urinalysis" },
    { id: 8, name: "Liver Function Test", category: "Biochemistry" },
  ];

  const handleTestToggle = (test) => {
    if (selectedTests.find((t) => t.id === test.id)) {
      setSelectedTests(selectedTests.filter((t) => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#235F72] to-[#085DB6] text-white p-6 rounded-t-xl">
          <h1 className="text-2xl font-bold">Register New Patient</h1>
          <p className="text-blue-100">
            Complete patient information and test requests
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Auto-generated Card Number */}
          <div className="bg-[#36F1A2] bg-opacity-20 border border-[#36F1A2] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-[#235F72] font-semibold">Card Number:</span>
              <span className="text-2xl font-bold text-[#235F72]">
                {cardNumber}
              </span>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                placeholder="+251 91 234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                placeholder="Full address"
              />
            </div>
          </div>

          {/* Test Selection */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Laboratory Tests
            </h3>

            {/* Test Search */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search tests..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
              />
            </div>

            {/* Test Categories */}
            <div className="flex space-x-2 mb-4 overflow-x-auto">
              {[
                "All",
                "Hematology",
                "Diabetes",
                "Infectious",
                "Urinalysis",
                "Biochemistry",
              ].map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-[#36F1A2] hover:text-[#235F72] whitespace-nowrap transition duration-200"
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Test List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2">
              {availableTests.map((test) => (
                <div
                  key={test.id}
                  onClick={() => handleTestToggle(test)}
                  className={`p-3 border rounded-lg cursor-pointer transition duration-200 ${
                    selectedTests.find((t) => t.id === test.id)
                      ? "border-[#36F1A2] bg-[#36F1A2] bg-opacity-10"
                      : "border-gray-300 hover:border-[#36F1A2]"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 border rounded mr-3 flex items-center justify-center ${
                        selectedTests.find((t) => t.id === test.id)
                          ? "bg-[#36F1A2] border-[#36F1A2]"
                          : "border-gray-400"
                      }`}
                    >
                      {selectedTests.find((t) => t.id === test.id) && "✓"}
                    </div>
                    <div>
                      <div className="font-medium">{test.name}</div>
                      <div className="text-sm text-gray-500">
                        {test.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Tests Summary */}
            {selectedTests.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-[#085DB6] mb-2">
                  Selected Tests ({selectedTests.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTests.map((test) => (
                    <span
                      key={test.id}
                      className="px-3 py-1 bg-[#085DB6] text-white rounded-full text-sm flex items-center"
                    >
                      {test.name}
                      <button
                        onClick={() => handleTestToggle(test)}
                        className="ml-2 hover:text-red-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
              Cancel
            </button>
            <button className="flex-1 bg-[#235F72] text-white py-3 rounded-lg font-semibold hover:bg-[#1a4a5a] transition duration-200 shadow-md">
              Register Patient & Create Test Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;
