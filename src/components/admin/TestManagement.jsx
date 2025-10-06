// components/admin/TestManagement.jsx
import React, { useState } from "react";

const TestManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const tests = [
    {
      id: 1,
      productClass: "Vitamin",
      testName: "Vitamin D",
      specimenType: "Blood",
      mixing: "-",
      mixture: "5",
      reactionTime: "15 min",
      linearRange: "5-100 ng/mL",
      clinicalReference: "30-100 ng/mL",
      antiregulant: "EDTA",
    },
    {
      id: 2,
      productClass: "Inflammation",
      testName: "CRP",
      specimenType: "Serum",
      mixing: "8.5 μL",
      mixture: "10 Times",
      reactionTime: "3 min",
      linearRange: "0.5-200 mg/L",
      clinicalReference: "0-10 mg/L",
      antiregulant: "Heparin, Sodium Citrate",
    },
    {
      id: 3,
      productClass: "Diabetes",
      testName: "HbA1c",
      specimenType: "Whole Blood",
      mixing: "10 μL",
      mixture: "10 Times",
      reactionTime: "5 min",
      linearRange: "4.0-14.5%",
      clinicalReference: "0-6.5%",
      antiregulant: "EDTA",
    },
    {
      id: 4,
      productClass: "Thyroid Function",
      testName: "T3",
      specimenType: "Serum",
      mixing: "75 μL",
      mixture: "10 Times",
      reactionTime: "15 min",
      linearRange: "0.4-9.12 nmol/L",
      clinicalReference: "1.3-3.1 nmol/L",
      antiregulant: "Heparin, Sodium Citrate",
    },
  ];

  const filteredTests = tests.filter(
    (test) =>
      test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.productClass.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <button className="flex items-center text-[#085DB6] hover:text-[#074a9b] mb-2">
              <span className="mr-2">←</span>
              Back
            </button>
            <h1 className="text-2xl font-bold text-[#235F72]">
              Test Management
            </h1>
          </div>
          <button className="bg-[#235F72] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold">
            Add New Test
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tests List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Product Class
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Test Name
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Specimen Type
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Mixing
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Mixture
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Reaction Time
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Linear Range
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Clinical Reference
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Antiregulant
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => (
                <tr
                  key={test.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-[#235F72] text-sm">
                      {test.productClass}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-sm">{test.testName}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {test.specimenType}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">{test.mixing}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">{test.mixture}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {test.reactionTime}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {test.linearRange}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {test.clinicalReference}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {test.antiregulant}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-[#085DB6] hover:text-[#074a9b] font-medium text-sm">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🧪</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Tests Found
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )}

        {/* More tests indicator */}
        {filteredTests.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="text-center text-gray-500 text-sm">
              ... (more tests)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestManagement;
