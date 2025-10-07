import React from "react";

const PrintDetailedReport = () => {
  const detailedReportData = {
    clinic: {
      name: " World Laboratory Center",
      address: "Bole Road, Addis Ababa, Ethiopia",
      phone: "+251 91 234 5678",
      license: "MED-LAB-ET-2024-001",
    },
    patient: {
      name: "Alemayu Teshome",
      cardNumber: "CLN-001",
      age: 25,
      gender: "Male",
      sampleId: "SMP-2024-12-15-001",
      collected: "Dec 15, 2024 10:15 AM",
      reported: "Dec 15, 2024 11:30 AM",
    },
    testSections: [
      {
        title: "COMPLETE BLOOD COUNT (CBC)",
        tests: [
          {
            parameter: "Hemoglobin",
            result: "13.5",
            unit: "g/dL",
            range: "13.0-17.0",
            status: "Normal",
          },
          {
            parameter: "WBC Count",
            result: "7.2",
            unit: "10³/μL",
            range: "4.5-11.0",
            status: "Normal",
          },
          {
            parameter: "Platelets",
            result: "250",
            unit: "10³/μL",
            range: "150-400",
            status: "Normal",
          },
          {
            parameter: "RBC Count",
            result: "4.8",
            unit: "10⁶/μL",
            range: "4.5-5.9",
            status: "Normal",
          },
          {
            parameter: "Hematocrit",
            result: "42",
            unit: "%",
            range: "40-50",
            status: "Normal",
          },
        ],
      },
      {
        title: "BIOCHEMISTRY",
        tests: [
          {
            parameter: "Blood Glucose (Fasting)",
            result: "95",
            unit: "mg/dL",
            range: "70-100",
            status: "Normal",
          },
          {
            parameter: "Vitamin D",
            result: "35",
            unit: "ng/mL",
            range: "30-100",
            status: "Normal",
          },
          {
            parameter: "CRP",
            result: "2.1",
            unit: "mg/L",
            range: "0-5",
            status: "Normal",
          },
        ],
      },
    ],
    interpretation: {
      cbc: "Complete Blood Count within normal physiological limits.",
      biochemistry: "Biochemical parameters within reference ranges.",
      overall:
        "No significant abnormalities detected. All tested parameters are within normal limits.",
    },
    personnel: {
      technician: "Lab Tech 01 (License: LT-ET-2024-001)",
      pathologist: "Dr. Sarah Mohammed, MD",
      signature: "Digitally verified and approved",
    },
    notes: [
      "Reference ranges are based on adult male population.",
      "Results are specific to the sample received and testing conditions.",
      "Critical values would be communicated immediately to the requesting physician.",
    ],
  };

  const getStatusIndicator = (status) => {
    switch (status) {
      case "Normal":
        return "●";
      case "Low":
        return "↓";
      case "High":
        return "↑";
      case "Critical":
        return "‼";
      default:
        return "";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Normal":
        return "text-green-600";
      case "Low":
        return "text-orange-600";
      case "High":
        return "text-red-600";
      case "Critical":
        return "text-red-800 font-bold";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto print:p-0 print:max-w-none">
      {/* Print Controls */}
      <div className="no-print mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-[#235F72]">
              Laboratory Report - Print Preview
            </h3>
            <p className="text-sm text-gray-600">
              Professional medical report format
            </p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => window.print()}
              className="bg-[#235F72] text-white px-6 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold"
            >
              🖨️ Print Report
            </button>
            <button
              onClick={() => window.history.back()}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              ← Back to Results
            </button>
          </div>
        </div>
      </div>

      {/* Printable Report */}
      <div className="print:block print:break-inside-avoid">
        {/* Header */}
        <div className="border-b-2 border-[#235F72] pb-4 mb-6 print:border-black">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-[#235F72] print:text-black">
                {detailedReportData.clinic.name}
              </h1>
              <p className="text-gray-600 print:text-black">
                {detailedReportData.clinic.address}
              </p>
              <p className="text-sm text-gray-500 print:text-black">
                Tel: {detailedReportData.clinic.phone} | License:{" "}
                {detailedReportData.clinic.license}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-[#235F72] print:text-black">
                LABORATORY REPORT
              </div>
              <div className="text-sm text-gray-500 print:text-black">
                Date: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Details */}
        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <div className="space-y-2">
            <div className="flex border-b border-gray-200 pb-1">
              <span className="font-semibold text-[#235F72] print:text-black w-40">
                Patient Name:
              </span>
              <span className="font-medium">
                {detailedReportData.patient.name}
              </span>
            </div>
            <div className="flex border-b border-gray-200 pb-1">
              <span className="font-semibold text-[#235F72] print:text-black w-40">
                Card Number:
              </span>
              <span>{detailedReportData.patient.cardNumber}</span>
            </div>
            <div className="flex border-b border-gray-200 pb-1">
              <span className="font-semibold text-[#235F72] print:text-black w-40">
                Sample ID:
              </span>
              <span>{detailedReportData.patient.sampleId}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex border-b border-gray-200 pb-1">
              <span className="font-semibold text-[#235F72] print:text-black w-40">
                Age / Gender:
              </span>
              <span>
                {detailedReportData.patient.age} years /{" "}
                {detailedReportData.patient.gender}
              </span>
            </div>
            <div className="flex border-b border-gray-200 pb-1">
              <span className="font-semibold text-[#235F72] print:text-black w-40">
                Collected:
              </span>
              <span>{detailedReportData.patient.collected}</span>
            </div>
            <div className="flex border-b border-gray-200 pb-1">
              <span className="font-semibold text-[#235F72] print:text-black w-40">
                Reported:
              </span>
              <span>{detailedReportData.patient.reported}</span>
            </div>
          </div>
        </div>

        {/* Test Results by Section */}
        {detailedReportData.testSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-6 break-inside-avoid">
            <h3 className="font-bold text-[#235F72] print:text-black text-lg mb-3 bg-gray-100 p-2 print:bg-gray-200">
              {section.title}
            </h3>
            <table className="w-full border-collapse border border-gray-300 text-sm mb-4">
              <thead>
                <tr className="bg-[#235F72] text-white print:bg-gray-800">
                  <th className="border border-gray-300 p-2 text-left w-1/3">
                    Test Parameter
                  </th>
                  <th className="border border-gray-300 p-2 text-left w-1/6">
                    Result
                  </th>
                  <th className="border border-gray-300 p-2 text-left w-1/6">
                    Unit
                  </th>
                  <th className="border border-gray-300 p-2 text-left w-1/4">
                    Reference Range
                  </th>
                  <th className="border border-gray-300 p-2 text-left w-1/6">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.tests.map((test, testIndex) => (
                  <tr key={testIndex}>
                    <td className="border border-gray-300 p-2">
                      {test.parameter}
                    </td>
                    <td className="border border-gray-300 p-2 font-semibold">
                      {test.result}
                    </td>
                    <td className="border border-gray-300 p-2 text-gray-600">
                      {test.unit}
                    </td>
                    <td className="border border-gray-300 p-2 text-gray-600">
                      {test.range}
                    </td>
                    <td
                      className={`border border-gray-300 p-2 font-medium ${getStatusColor(
                        test.status
                      )}`}
                    >
                      <span className="mr-1">
                        {getStatusIndicator(test.status)}
                      </span>
                      {test.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Interpretation */}
        <div className="mb-6 break-inside-avoid">
          <h3 className="font-bold text-[#235F72] print:text-black mb-3">
            INTERPRETATION
          </h3>
          <div className="border border-gray-300 p-4 rounded bg-gray-50 print:bg-white">
            <p className="text-sm mb-2">
              {detailedReportData.interpretation.overall}
            </p>
            <ul className="text-sm list-disc list-inside space-y-1">
              <li>{detailedReportData.interpretation.cbc}</li>
              <li>{detailedReportData.interpretation.biochemistry}</li>
            </ul>
          </div>
        </div>

        {/* Personnel & Verification */}
        <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t border-gray-300 break-inside-avoid">
          <div>
            <div className="mb-2 text-sm font-semibold">
              LABORATORY PERSONNEL
            </div>
            <div className="space-y-2 text-sm">
              <div>Performed by: {detailedReportData.personnel.technician}</div>
              <div>Verified by: {detailedReportData.personnel.pathologist}</div>
              <div className="text-xs text-gray-600 mt-2">
                {detailedReportData.personnel.signature}
              </div>
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold">NOTES</div>
            <ul className="text-xs text-gray-600 space-y-1">
              {detailedReportData.notes.map((note, index) => (
                <li key={index}>• {note}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500 break-inside-avoid">
          <p>*** END OF REPORT ***</p>
          <p className="mt-1">
            This report should be interpreted in the context of the patient's
            clinical condition
          </p>
          <p>Printed on: {new Date().toLocaleString("en-ET")} | Page 1 of 1</p>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          @page {
            margin: 0.5in;
            size: A4;
          }
          .no-print {
            display: none !important;
          }
          body {
            margin: 0;
            padding: 0;
            background: white;
            font-size: 12pt;
            line-height: 1.4;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:text-black {
            color: black !important;
          }
          .print\\:border-black {
            border-color: black !important;
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .break-inside-avoid {
            break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintDetailedReport;
