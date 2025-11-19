import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTestOrderById } from "../../store/slices/testOrderSlice";

const PrintDetailedReport = ({ testOrderId }) => {
  const dispatch = useDispatch();
  const { currentTestOrder } = useSelector((state) => state.testOrders);

  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);

  // Fetch test order data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        if (testOrderId) {
          await dispatch(fetchTestOrderById(testOrderId)).unwrap();
        }
      } catch (error) {
        console.error("Error fetching test order data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, testOrderId]);

  // Transform data for the report when test order is loaded
  useEffect(() => {
    if (currentTestOrder) {
      const transformedData = transformReportData(currentTestOrder);
      setReportData(transformedData);
    }
  }, [currentTestOrder]);

  // ...existing code...
  const transformReportData = (testOrderWrapped) => {
    // normalize wrapper shape: controller returns { success, message, data } while slices sometimes set data directly
    const order = testOrderWrapped?.data || testOrderWrapped || {};

    const patientName = order.patient_name || order.patient?.full_name || "N/A";
    const cardNumber = order.card_number || order.patient?.card_number || "N/A";
    const age = order.patient_age ?? order.patient?.age ?? "N/A";
    const genderRaw = order.patient_gender || order.patient?.gender || "N/A";
    const gender =
      typeof genderRaw === "string"
        ? genderRaw.charAt(0).toUpperCase() + genderRaw.slice(1)
        : "N/A";

    const collected = order.sample_collected_at || order.ordered_at || null;
    const reported =
      order.completed_at || order.reported_at || order.updated_at || null;

    const statusRaw = order.status || order.state || null;
    const formattedStatus = statusRaw
      ? String(statusRaw)
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "N/A";

    const priority =
      order.priority && typeof order.priority === "string"
        ? order.priority.charAt(0).toUpperCase() + order.priority.slice(1)
        : "Normal";

    return {
      clinic: {
        name: "ወርልድ ላቦራቶሪ ማዕከል",
        englishName: "World Basic Laboratory",
        address: "አድራሻ፡ በፓውሎስ ሆስፒታል አቅራቢ በኬዛክ ፋርማሲ አጠገብ",
        englishAddress: "Address: Paulos Hospital near Kezak Pharmacy",
        phone: "0911-219802 / 0911261414",
        mission: "አላማችን ደንበኞቻችንን በላቀ ቴክኖሎጂ እና በተመጣጣኝ ክፍያ ማገልገል ነው!!!",
      },
      patient: {
        name: patientName,
        cardNumber: cardNumber,
        age: age,
        gender: gender,
        sampleId: `TO-${order.id}` || "N/A",
        collected: collected
          ? new Date(collected).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Not collected",
        reported: reported
          ? new Date(reported).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Pending",
        orderedAt: order.ordered_at
          ? new Date(order.ordered_at).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
      },
      testInfo: {
        name: order.test_name || order.test?.name || "N/A",
        category: order.category_name || order.category?.name || "N/A",
        priority,
        status: formattedStatus,
        sampleType:
          order.sample_type && typeof order.sample_type === "string"
            ? order.sample_type.charAt(0).toUpperCase() +
              order.sample_type.slice(1)
            : "N/A",
      },
      dynamicAnswers: order.dynamic_answers || {},
      testSections: transformTestSections(order),
    };
  };

  const transformTestSections = (order) => {
    // Order is normalized (not wrapper). Prefer explicit parameter results if present.
    const source = order || {};

    // If actual parameterized results exist (from test results endpoint)
    if (
      Array.isArray(source.parameter_results) &&
      source.parameter_results.length
    ) {
      return [
        {
          title: source.test_name || source.test?.name || "TEST RESULTS",
          tests: source.parameter_results.map((param) => ({
            parameter: param.parameter_name || param.name || "N/A",
            result: param.result_value ?? param.result ?? "N/A",
            unit: param.unit || "",
            range: param.reference_range || param.normal_range || "",
            status: (() => {
              const value = parseFloat(param.result_value ?? param.result);
              if (isNaN(value)) return "Normal";
              if (param.reference_range) {
                const [min, max] = String(param.reference_range)
                  .split("-")
                  .map(Number);
                if (!isNaN(min) && value < min) return "Low";
                if (!isNaN(max) && value > max) return "High";
              }
              return "Normal";
            })(),
          })),
        },
      ];
    }

    // Fallback: use dynamic answers if present
    if (source.dynamic_answers && Object.keys(source.dynamic_answers).length) {
      return [
        {
          title: source.test_name || source.test?.name || "TEST",
          tests: Object.entries(source.dynamic_answers).map(([k, v]) => ({
            parameter: `Q${k}`,
            result: String(v),
            unit: "",
            range: "",
            status: "Normal",
          })),
        },
      ];
    }

    // Default placeholder section
    return [
      {
        title: source.test_name || source.test?.name || "TEST RESULTS",
        tests: [
          {
            parameter: "Result",
            result: source.result_value ?? source.result ?? "N/A",
            unit: source.unit || "",
            range: source.reference_range || "",
            status: "Normal",
          },
        ],
      },
    ];
  };

  const getStatusIndicator = (status) => {
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

  const getStatusColor = (status) => {
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

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading report...</div>
      </div>
    );
  }

  // Show error state if no data
  if (!reportData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Failed to load report data</div>
      </div>
    );
  }

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
        <div className="flex items-center justify-center gap-4">
          <img src="/logo.png" alt="Logo" width={70} height={70} />
          <div className="">
            <h1 className="text-2xl font-bold text-[#0A6ADA] leading-tight">
              {reportData.clinic.name}
            </h1>
            <h2 className="font-semibold text-xl text-[#0A6ADA] italic">
              {reportData.clinic.englishName}
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              ስልክ: {reportData.clinic.phone}
            </p>
          </div>
        </div>
        <hr className="mt-3 border-t-4 border-[#235F72]" />
        <hr className="mt-1 border-t-4 border-[#36F19F]" />
      </div>

      {/* Patient Info and Report */}
      <div className="relative z-10">
        {/* Patient Information */}
        <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Patient:</span>{" "}
              {reportData.patient.name}
            </p>
            <p>
              <span className="font-semibold">Card No:</span>{" "}
              {reportData.patient.cardNumber}
            </p>
            <p>
              <span className="font-semibold">Sample ID:</span>{" "}
              {reportData.patient.sampleId}
            </p>
            <p>
              <span className="font-semibold">Test:</span>{" "}
              {reportData.testInfo.name}
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Age/Gender:</span>{" "}
              {reportData.patient.age} / {reportData.patient.gender}
            </p>
            <p>
              <span className="font-semibold">Ordered:</span>{" "}
              {reportData.patient.orderedAt}
            </p>
            <p>
              <span className="font-semibold">Collected:</span>{" "}
              {reportData.patient.collected}
            </p>
            <p>
              <span className="font-semibold">Reported:</span>{" "}
              {reportData.patient.reported}
            </p>
          </div>
        </div>

        {/* Test Information */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-[#235F72] mb-3">Test Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-semibold">Category:</span>{" "}
              {reportData.testInfo.category}
            </div>
            <div>
              <span className="font-semibold">Priority:</span>{" "}
              {reportData.testInfo.priority}
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              {reportData.testInfo.status}
            </div>
            <div>
              <span className="font-semibold">Sample Type:</span>{" "}
              {reportData.testInfo.sampleType}
            </div>
          </div>
        </div>

        {/* Dynamic Questions (if any) */}
        {Object.keys(reportData.dynamicAnswers).length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold text-[#235F72] text-lg mb-3 bg-gray-100 p-2">
              Patient Questionnaire
            </h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border-b border-gray-300 p-2 text-left">
                      Question
                    </th>
                    <th className="border-b border-gray-300 p-2 text-left">
                      Answer
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(reportData.dynamicAnswers).map(
                    ([questionId, answer]) => (
                      <tr
                        key={questionId}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="p-2 border-r border-gray-300">
                          Question {questionId}
                        </td>
                        <td className="p-2">{answer}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Test Results */}
        {reportData.testSections.map((section, i) => (
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
        <p>{reportData.clinic.address}</p>
        <p>{reportData.clinic.englishAddress}</p>
        <p>{reportData.clinic.mission}</p>
      </div>

      {/* Print Button (hidden during actual print) */}
      <div className="no-print mt-6 text-center">
        <button
          onClick={() => window.print()}
          className="bg-[#235F72] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold"
        >
          Print Report
        </button>
      </div>

      <style>{`
  @media print {
    @page {
      margin: 0.6in;
      size: A4;
    }
    .no-print {
      display: none !important;
    }
    body {
      background: white !important;
      -webkit-print-color-adjust: exact;
    }
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
    }
  }
`}</style>
    </div>
  );
};

export default PrintDetailedReport;
