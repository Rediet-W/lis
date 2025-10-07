import React, { useState } from "react";

const ResultEntryForm = () => {
  const [results, setResults] = useState({
    hemoglobin: "13.5",
    wbc: "7.2",
    platelets: "250",
    rbc: "4.8",
    hematocrit: "42",
  });

  const [comments, setComments] = useState("");
  const [remarks, setRemarks] = useState({
    requiresRepeat: false,
    inconclusive: false,
    criticalValue: false,
  });

  const testInfo = {
    patient: {
      name: "Alemayu Teshome",
      cardNumber: "CLN-001",
      age: 25,
      gender: "male",
      collected: "2024-12-15 10:15 AM",
    },
    test: {
      name: "Complete Blood Count (CBC)",
      sampleType: "Whole Blood",
      tubeType: "EDTA",
    },
    referenceRanges: {
      hemoglobin: { min: 13.0, max: 17.0, unit: "g/dL" },
      wbc: { min: 4.5, max: 11.0, unit: "10³/μL" },
      platelets: { min: 150, max: 400, unit: "10³/μL" },
      rbc: { min: 4.5, max: 5.9, unit: "10⁶/μL" },
      hematocrit: { min: 40, max: 50, unit: "%" },
    },
  };

  const calculateStatus = (parameter, value) => {
    const range = testInfo.referenceRanges[parameter];
    const numValue = parseFloat(value);

    if (isNaN(numValue)) return "unknown";
    if (numValue < range.min) return "low";
    if (numValue > range.max) return "high";
    return "normal";
  };

  const getStatusColor = (status) => {
    const colors = {
      normal: "text-green-600 bg-green-100 border-green-200",
      low: "text-orange-600 bg-orange-100 border-orange-200",
      high: "text-red-600 bg-red-100 border-red-200",
      unknown: "text-gray-600 bg-gray-100 border-gray-200",
    };
    return colors[status];
  };

  const getStatusIcon = (status) => {
    const icons = {
      normal: "✅",
      low: "📉",
      high: "📈",
      unknown: "❓",
    };
    return icons[status];
  };

  const handleResultChange = (parameter, value) => {
    setResults((prev) => ({
      ...prev,
      [parameter]: value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#235F72] to-[#085DB6] text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Enter Test Results</h1>
              <p className="text-blue-100">Complete Blood Count (CBC)</p>
            </div>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition duration-200">
              ← Back to Queue
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Information */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h3 className="font-semibold text-[#235F72] mb-3">
              Patient Information
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span>{" "}
                {testInfo.patient.name}
              </div>
              <div>
                <span className="font-medium">Card No:</span>{" "}
                {testInfo.patient.cardNumber}
              </div>
              <div>
                <span className="font-medium">Age/Gender:</span>{" "}
                {testInfo.patient.age} / {testInfo.patient.gender}
              </div>
              <div>
                <span className="font-medium">Collected:</span>{" "}
                {testInfo.patient.collected}
              </div>
            </div>
          </div>

          {/* Test Parameters */}
          <div>
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Test Parameters
            </h3>
            <div className="space-y-4">
              {Object.entries(testInfo.referenceRanges).map(
                ([param, range]) => {
                  const status = calculateStatus(param, results[param]);

                  return (
                    <div
                      key={param}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="md:col-span-3">
                        <label className="block font-medium text-gray-700 capitalize">
                          {param.replace(/([A-Z])/g, " $1")}
                        </label>
                        <div className="text-sm text-gray-500">
                          Ref: {range.min}-{range.max} {range.unit}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <input
                          type="text"
                          value={results[param]}
                          onChange={(e) =>
                            handleResultChange(param, e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <span className="text-gray-600">{range.unit}</span>
                      </div>

                      <div className="md:col-span-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                            status
                          )}`}
                        >
                          <span className="mr-1">{getStatusIcon(status)}</span>
                          {status.toUpperCase()}
                        </span>
                      </div>

                      <div className="md:col-span-2 text-right">
                        {status === "critical" && (
                          <span className="text-red-600 font-medium text-sm">
                            CRITICAL!
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comments & Observations
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
              placeholder="Enter any observations, technical comments, or special notes..."
            />
          </div>

          {/* Final Remarks */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Final Remarks
            </h3>
            <div className="space-y-3">
              {Object.entries(remarks).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) =>
                      setRemarks((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-[#36F1A2] border-gray-300 rounded focus:ring-[#36F1A2]"
                  />
                  <span className="ml-2 text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6 border-t">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200">
              Save Draft
            </button>
            <button className="flex-1 bg-[#36F1A2] text-[#235F72] py-3 rounded-lg font-semibold hover:bg-[#2dd191] transition duration-200 shadow-md">
              Verify & Finalize Results
            </button>
            <button className="flex-1 bg-[#235F72] text-white py-3 rounded-lg font-semibold hover:bg-[#1a4a5a] transition duration-200 shadow-md">
              Submit & Next Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultEntryForm;
