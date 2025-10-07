import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("pending");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const pendingTests = [
    {
      id: 1,
      patientName: "Abel Teshome",
      cardNumber: "CLN-001",
      age: 25,
      gender: "male",
      tests: ["CBC", "Blood Glucose"],
      collectedTime: "10:15 AM",
    },
    {
      id: 2,
      patientName: "Sara Mohammed",
      cardNumber: "CLN-002",
      age: 30,
      gender: "female",
      tests: ["Urine Analysis", "Pregnancy Test"],
      collectedTime: "10:20 AM",
      dynamicQuestions: { pregnant: "Yes" },
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Main Dashboard Content */}
        <main className="p-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-[#235F72] mb-6">
              Pending Tests Queue
            </h2>

            <div className="space-y-4">
              {pendingTests.map((test) => (
                <div
                  key={test.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#36F1A2] transition duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#235F72] text-lg mb-2">
                        Patient: {test.patientName}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div>
                          Card: {test.cardNumber} | Age: {test.age} | Gender:{" "}
                          {test.gender}
                        </div>
                        <div>Tests: {test.tests.join(", ")}</div>
                      </div>

                      {/* Dynamic Questions */}
                      {test.dynamicQuestions && (
                        <div className="bg-blue-50 p-2 rounded border border-blue-200 text-sm">
                          <span className="font-medium text-[#085DB6]">
                            Additional Info:
                          </span>
                          {Object.entries(test.dynamicQuestions).map(
                            ([key, value]) => (
                              <span key={key} className="ml-2">
                                {key}: {value}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      className="ml-4 bg-[#235F72] text-white px-4 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-medium whitespace-nowrap"
                      onClick={() => navigate("/laboratory/enter-results")}
                    >
                      Enter Results
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {pendingTests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎉</div>
                <p>No pending tests in the queue.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
