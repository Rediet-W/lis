// src/components/receptionist/TestOrders.jsx
import React, { useState } from "react";

const TestOrders = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedTests, setSelectedTests] = useState([]);

  const patients = [
    { id: 1, name: "Abel Teshome", cardNumber: "CLN-001" },
    { id: 2, name: "Sara Mohammed", cardNumber: "CLN-002" },
    { id: 3, name: "Mikias Haile", cardNumber: "CLN-003" },
  ];

  const testCategories = [
    {
      name: "Hematology",
      tests: [
        { id: 1, name: "Complete Blood Count (CBC)", price: 150 },
        { id: 2, name: "Hemoglobin", price: 80 },
        { id: 3, name: "Platelet Count", price: 80 },
      ],
    },
    {
      name: "Biochemistry",
      tests: [
        { id: 4, name: "Blood Glucose (Fasting)", price: 100 },
        { id: 5, name: "Blood Glucose (Random)", price: 100 },
        { id: 6, name: "Liver Function Test", price: 300 },
        { id: 7, name: "Kidney Function Test", price: 280 },
      ],
    },
    {
      name: "Infectious Diseases",
      tests: [
        { id: 8, name: "Malaria Test", price: 120 },
        { id: 9, name: "Typhoid Test", price: 150 },
        { id: 10, name: "HIV Test", price: 200 },
      ],
    },
  ];

  const handleTestToggle = (test) => {
    if (selectedTests.find((t) => t.id === test.id)) {
      setSelectedTests(selectedTests.filter((t) => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const calculateTotal = () => {
    return selectedTests.reduce((total, test) => total + test.price, 0);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#235F72]">Test Orders</h1>
        <p className="text-gray-600">
          Create and manage laboratory test orders
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Select Patient
            </h3>

            <div className="space-y-3">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-3 border rounded-lg cursor-pointer transition duration-200 ${
                    selectedPatient?.id === patient.id
                      ? "border-[#36F1A2] bg-[#36F1A2] bg-opacity-10"
                      : "border-gray-300 hover:border-[#36F1A2]"
                  }`}
                >
                  <div className="font-medium text-[#235F72]">
                    {patient.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {patient.cardNumber}
                  </div>
                </div>
              ))}
            </div>

            {selectedPatient && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="font-medium text-green-800">
                  Selected Patient:
                </div>
                <div className="text-sm text-green-700">
                  {selectedPatient.name} ({selectedPatient.cardNumber})
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Test Selection */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Select Tests
            </h3>

            {!selectedPatient ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">👥</div>
                <p>Please select a patient first</p>
              </div>
            ) : (
              <>
                {/* Test Categories */}
                <div className="space-y-6">
                  {testCategories.map((category) => (
                    <div key={category.name}>
                      <h4 className="font-semibold text-[#235F72] mb-3 border-b pb-2">
                        {category.name}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {category.tests.map((test) => (
                          <div
                            key={test.id}
                            onClick={() => handleTestToggle(test)}
                            className={`p-3 border rounded-lg cursor-pointer transition duration-200 ${
                              selectedTests.find((t) => t.id === test.id)
                                ? "border-[#36F1A2] bg-[#36F1A2] bg-opacity-10"
                                : "border-gray-300 hover:border-[#36F1A2]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{test.name}</div>
                                <div className="text-sm text-gray-600">
                                  ETB {test.price}
                                </div>
                              </div>
                              <div
                                className={`w-5 h-5 border rounded flex items-center justify-center ${
                                  selectedTests.find((t) => t.id === test.id)
                                    ? "bg-[#36F1A2] border-[#36F1A2]"
                                    : "border-gray-400"
                                }`}
                              >
                                {selectedTests.find((t) => t.id === test.id) &&
                                  "✓"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Tests Summary */}
                {selectedTests.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-[#085DB6] mb-3">
                      Selected Tests ({selectedTests.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedTests.map((test) => (
                        <div
                          key={test.id}
                          className="flex justify-between items-center"
                        >
                          <span>{test.name}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-[#235F72] font-medium">
                              ETB {test.price}
                            </span>
                            <button
                              onClick={() => handleTestToggle(test)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span className="text-[#235F72]">
                        ETB {calculateTotal()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex space-x-3">
                  <button
                    disabled={selectedTests.length === 0}
                    className={`px-6 py-3 rounded-lg font-semibold transition duration-200 ${
                      selectedTests.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#235F72] text-white hover:bg-[#1a4a5a]"
                    }`}
                  >
                    Create Order
                  </button>
                  <button
                    onClick={() => setSelectedTests([])}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Clear Selection
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestOrders;
