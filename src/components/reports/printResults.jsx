import React from "react";

const PrintDetailedReport = () => {
  const detailedReportData = {
    clinic: {
      name: "World Laboratory Center",
      address: "Address: Paulos Hospital, near Kezak Pharmacy",
      phone: "0911-219802 / 0911261414",
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
    ],
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "Normal":
        return "●";
      case "Low":
        return "↓";
      case "High":
        return "↑";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "text-green-600";
      case "Low":
        return "text-orange-600";
      case "High":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="relative bg-white p-8 max-w-4xl mx-auto print:p-0 print:max-w-none">
      {/* Watermark Background */}
      <div className="absolute inset-0 flex justify-center items-center opacity-10 print:opacity-10 z-0">
        <img
          src="/logo.png"
          alt="Watermark"
          width={500}
          height={500}
          className="object-contain"
        />
      </div>

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="flex items-center justify-center gap-4 ">
          <img src="/logo.png" alt="Logo" width={70} height={70} />
          <div className="">
            <h1 className="text-2xl font-bold text-[#0A6ADA] leading-tight">
              ወርልድ ላቦራቶሪ ማዕከል
            </h1>
            <h2 className="font-semibold text-xl text-[#0A6ADA] italic">
              World Laboratory Center
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              ስልክ: 0911-219802 / 0911261414
            </p>
          </div>
        </div>
        <hr className="mt-3 border-t-4 border-[#235F72]" />
        <hr className="mt-1 border-t-4 border-[#36F19F]" />
      </div>

      {/* Patient Info and Report */}
      <div className="relative z-10">
        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Patient:</span>{" "}
              {detailedReportData.patient.name}
            </p>
            <p>
              <span className="font-semibold">Card No:</span>{" "}
              {detailedReportData.patient.cardNumber}
            </p>
            <p>
              <span className="font-semibold">Sample ID:</span>{" "}
              {detailedReportData.patient.sampleId}
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Age/Gender:</span>{" "}
              {detailedReportData.patient.age} /{" "}
              {detailedReportData.patient.gender}
            </p>
            <p>
              <span className="font-semibold">Collected:</span>{" "}
              {detailedReportData.patient.collected}
            </p>
            <p>
              <span className="font-semibold">Reported:</span>{" "}
              {detailedReportData.patient.reported}
            </p>
          </div>
        </div>

        {detailedReportData.testSections.map((section, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-bold text-[#235F72] text-lg mb-3 bg-gray-100 p-2">
              {section.title}
            </h3>
            <table className="w-full border-collapse border border-gray-300 text-sm">
              <thead>
                <tr className="bg-[#235F72] text-white">
                  <th className="border border-gray-300 p-2 text-left">
                    Parameter
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Result
                  </th>
                  <th className="border border-gray-300 p-2 text-left">Unit</th>
                  <th className="border border-gray-300 p-2 text-left">
                    Range
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {section.tests.map((test, j) => (
                  <tr key={j}>
                    <td className="border border-gray-300 p-2">
                      {test.parameter}
                    </td>
                    <td className="border border-gray-300 p-2 font-semibold">
                      {test.result}
                    </td>
                    <td className="border border-gray-300 p-2">{test.unit}</td>
                    <td className="border border-gray-300 p-2">{test.range}</td>
                    <td
                      className={`border border-gray-300 p-2 ${getStatusColor(
                        test.status
                      )}`}
                    >
                      {getStatusIndicator(test.status)} {test.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-10 text-center text-[#36F19F] font-semibold relative z-10">
        <p>አድራሻ፡ በፓውሎስ ሆስፒታል አቅራቢ በኬዛክ ፋርማሲ አጠገብ</p>
        <p>Address Paulos Hospital near Kezak Pharmacy</p>
        <p>አላማችን ደንበኞቻችንን በላቀ ቴክኖሎጂ እና በተመጣጣኝ ክፍያ ማገልገል ነው!!!</p>
      </div>

      <style jsx>{`
        @media print {
          @page {
            margin: 0.6in;
            size: A4;
          }
          .no-print {
            display: none !important;
          }
          body {
            background: white;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintDetailedReport;
