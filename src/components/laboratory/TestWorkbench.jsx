import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestOrders,
  fetchTestOrderResults,
  updateTestOrderStatus,
} from "../../store/slices/testOrderSlice";
import { fetchTests } from "../../store/slices/testSlice";
import { fetchTestParameters } from "../../store/slices/testParameterSlice";
import { fetchReferenceRanges } from "../../store/slices/referenceRangeSlice";
import { fetchDynamicQuestions } from "../../store/slices/dynamicQuestionSlice";
import ResultEntryForm from "./ResultEntryForm";

const statusGroups = {
  pending: ["ordered", "sample_collected"],
  in_progress: ["in_progress"],
  completed: ["completed"],
};

const TestWorkbench = () => {
  const dispatch = useDispatch();
  const { testOrders, loading, error } = useSelector((s) => s.testOrders || {});
  const { tests } = useSelector((s) => s.tests || {});
  const { parameters: allParameters } = useSelector(
    (s) => s.testParameters || {}
  );
  const { referenceRanges } = useSelector((s) => s.referenceRanges || {});
  const { dynamicQuestions } = useSelector((s) => s.dynamicQuestions || {});

  const [activeTab, setActiveTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEntry, setShowEntry] = useState(false);

  // Fetch all required data
  useEffect(() => {
    dispatch(fetchTestOrders({}));
    dispatch(fetchTests());
    dispatch(fetchTestParameters());
    dispatch(fetchReferenceRanges());
    dispatch(fetchDynamicQuestions());
  }, [dispatch]);

  const orders = useMemo(
    () => (Array.isArray(testOrders) ? testOrders : testOrders?.data || []),
    [testOrders]
  );

  const testsById = useMemo(() => {
    const list = Array.isArray(tests) ? tests : tests?.data || [];
    return Object.fromEntries(list.map((t) => [t.id, t]));
  }, [tests]);

  // Build complete parameter data with reference ranges
  const parametersByTestId = useMemo(() => {
    const list = Array.isArray(allParameters) ? allParameters : [];
    const ranges = Array.isArray(referenceRanges) ? referenceRanges : [];
    const questions = Array.isArray(dynamicQuestions) ? dynamicQuestions : [];

    const grouped = {};

    for (const p of list) {
      const testId = Number(p.test_id);
      if (!testId) continue;

      if (!grouped[testId]) grouped[testId] = [];

      // Find reference ranges for this parameter
      const paramRanges = ranges.filter((range) => range.parameter_id === p.id);

      // Find dynamic questions for this test
      const testQuestions = questions.filter((q) => q.test_id === testId);

      grouped[testId].push({
        id: p.id,
        test_id: testId,
        name: p.parameter_name,
        unit: p.unit,
        data_type: p.data_type || "numeric",
        reference_ranges: paramRanges, // Multiple ranges based on conditions
        dynamic_questions: testQuestions,
        description: p.description,
        created_at: p.created_at,
      });
    }
    return grouped;
  }, [allParameters, referenceRanges, dynamicQuestions]);

  // Find appropriate reference range for a parameter based on patient data
  const findReferenceRange = (parameter, order) => {
    if (
      !parameter.reference_ranges ||
      parameter.reference_ranges.length === 0
    ) {
      return null;
    }

    const patientAge = order.age; // Should come from patient data
    const patientGender = order.gender; // Should come from patient data
    const sampleType = order.sample_type; // From test order

    // Find the most specific reference range
    const ranges = parameter.reference_ranges;

    // First try to find exact match
    let bestMatch = ranges.find(
      (range) =>
        range.gender === patientGender &&
        range.sample_type === sampleType &&
        (!range.min_age || patientAge >= range.min_age) &&
        (!range.max_age || patientAge <= range.max_age)
    );

    // If no exact match, try gender match only
    if (!bestMatch) {
      bestMatch = ranges.find(
        (range) =>
          range.gender === patientGender &&
          (!range.min_age || patientAge >= range.min_age) &&
          (!range.max_age || patientAge <= range.max_age)
      );
    }

    // If still no match, try any range that matches age
    if (!bestMatch) {
      bestMatch = ranges.find(
        (range) =>
          (!range.min_age || patientAge >= range.min_age) &&
          (!range.max_age || patientAge <= range.max_age)
      );
    }

    // Return the first range if no specific match found
    return bestMatch || ranges[0];
  };

  const filtered = useMemo(() => {
    const set = new Set(statusGroups[activeTab] || []);
    const s = search.trim().toLowerCase();
    return orders.filter((o) => {
      const statusOk = set.size === 0 ? true : set.has(o.status);
      if (!s) return statusOk;
      const testName = (testsById[o.test_id]?.name || "").toLowerCase();
      const patient = (o.patient_name || o.full_name || "").toLowerCase();
      const card = (o.card_number || "").toLowerCase();
      return (
        statusOk &&
        (testName.includes(s) ||
          patient.includes(s) ||
          card.includes(s) ||
          String(o.id).includes(s))
      );
    });
  }, [orders, activeTab, search, testsById]);

  const openEntry = async (order) => {
    setSelectedOrder(order);
    await dispatch(fetchTestOrderResults(order.id)).catch(() => {});
    setShowEntry(true);
  };

  const closeEntry = () => {
    setSelectedOrder(null);
    setShowEntry(false);
  };

  const markInProgress = async (order) => {
    try {
      await dispatch(
        updateTestOrderStatus({ id: order.id, status: "in_progress" })
      ).unwrap();
    } catch (e) {
      console.error("Failed to mark in progress:", e);
    }
  };

  const markCompleted = async (order) => {
    try {
      await dispatch(
        updateTestOrderStatus({ id: order.id, status: "completed" })
      ).unwrap();
    } catch (e) {
      console.error("Failed to mark completed:", e);
    }
  };

  const getTestParameters = (order) => {
    const params = parametersByTestId[order.test_id] || [];

    // Enhance parameters with their reference ranges for this specific patient
    const enhancedParams = params.map((param) => ({
      ...param,
      applicable_reference_range: findReferenceRange(param, order),
    }));

    return enhancedParams;
  };

  const hasDynamicQuestions = (order) => {
    const params = parametersByTestId[order.test_id] || [];
    return (
      params.some(
        (param) => param.dynamic_questions && param.dynamic_questions.length > 0
      ) ||
      (order.dynamic_answers && Object.keys(order.dynamic_answers).length > 0)
    );
  };

  const getDynamicQuestionsInfo = (order) => {
    const params = parametersByTestId[order.test_id] || [];
    const allQuestions = params.flatMap(
      (param) => param.dynamic_questions || []
    );

    return {
      questions: allQuestions,
      answers: order.dynamic_answers || {},
    };
  };

  const columns = [
    { key: "id", name: "Order #" },
    { key: "patient", name: "Patient" },
    { key: "test", name: "Test" },
    { key: "parameters", name: "Parameters" },
    { key: "priority", name: "Priority" },
    { key: "status", name: "Status" },
    { key: "actions", name: "Actions" },
  ];

  // Show loading state
  if (loading && orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading test orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#235F72]">
          Laboratory Workbench
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => {
              dispatch(fetchTestOrders({}));
              dispatch(fetchTestParameters());
              dispatch(fetchReferenceRanges());
              dispatch(fetchDynamicQuestions());
            }}
            className="px-4 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a]"
          >
            {loading ? "Refreshing..." : "Refresh All"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {String(error)}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="text-2xl font-bold text-blue-600">
            {
              orders.filter((o) => statusGroups.pending.includes(o.status))
                .length
            }
          </div>
          <div className="text-sm text-gray-600">Pending Tests</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="text-2xl font-bold text-orange-600">
            {
              orders.filter((o) => statusGroups.in_progress.includes(o.status))
                .length
            }
          </div>
          <div className="text-sm text-gray-600">In Progress</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="text-2xl font-bold text-green-600">
            {
              orders.filter((o) => statusGroups.completed.includes(o.status))
                .length
            }
          </div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="text-2xl font-bold text-red-600">
            {orders.filter((o) => o.priority === "urgent").length}
          </div>
          <div className="text-sm text-gray-600">Urgent Priority</div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex gap-2">
          {[
            {
              id: "pending",
              label: "Pending",
              count: orders.filter((o) =>
                statusGroups.pending.includes(o.status)
              ).length,
            },
            {
              id: "in_progress",
              label: "In Progress",
              count: orders.filter((o) =>
                statusGroups.in_progress.includes(o.status)
              ).length,
            },
            {
              id: "completed",
              label: "Completed",
              count: orders.filter((o) =>
                statusGroups.completed.includes(o.status)
              ).length,
            },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                activeTab === t.id
                  ? "bg-[#235F72] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t.label}
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === t.id
                    ? "bg-white text-[#235F72]"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-80">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order, patient, card or test..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className="text-left py-4 px-6 text-[#235F72] font-semibold"
                  >
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const testName =
                  testsById[o.test_id]?.name || `Test #${o.test_id}`;
                const patient =
                  o.patient_name ||
                  o.full_name ||
                  `Patient #${o.patient_id || "-"}`;
                const card = o.card_number ? `(${o.card_number})` : "";
                const parameters = getTestParameters(o);

                const priorityBadge =
                  o.priority === "urgent"
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-gray-100 text-gray-800";

                const statusMap = {
                  ordered: "bg-blue-100 text-blue-800 border border-blue-200",
                  sample_collected:
                    "bg-purple-100 text-purple-800 border border-purple-200",
                  in_progress:
                    "bg-orange-100 text-orange-800 border border-orange-200",
                  completed:
                    "bg-green-100 text-green-800 border border-green-200",
                  cancelled: "bg-gray-100 text-gray-700 border border-gray-200",
                };

                return (
                  <tr
                    key={o.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6 font-semibold text-[#235F72]">
                      #{o.id}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-gray-800 font-medium">
                        {patient}
                        {card && (
                          <span className="text-gray-500 ml-1">{card}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Age: {o.age || "N/A"} • Gender: {o.gender || "N/A"}
                      </div>
                      {hasDynamicQuestions(o) && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">
                            📋 Has Additional Info
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium">{testName}</div>
                      {o.sample_type && (
                        <div className="text-xs text-gray-500">
                          Sample: {o.sample_type}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm">
                        {parameters.length > 0
                          ? `${parameters.length} parameter(s)`
                          : "No parameters"}
                      </div>
                      {parameters.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {parameters.map((p) => p.name).join(", ")}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${priorityBadge}`}
                      >
                        {o.priority || "normal"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          statusMap[o.status] || ""
                        }`}
                      >
                        {o.status ? o.status.replace(/_/g, " ") : "unknown"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        {o.status !== "in_progress" &&
                          o.status !== "completed" && (
                            <button
                              onClick={() => markInProgress(o)}
                              className="text-sm bg-[#085DB6] text-white px-3 py-1 rounded hover:bg-[#074a9b] font-medium"
                            >
                              Start
                            </button>
                          )}
                        {(o.status === "in_progress" ||
                          o.status === "sample_collected") && (
                          <button
                            onClick={() => openEntry(o)}
                            className="text-sm bg-[#235F72] text-white px-3 py-1 rounded hover:bg-[#1a4a5a] font-medium"
                          >
                            Enter Results
                          </button>
                        )}
                        {o.status === "in_progress" && (
                          <button
                            onClick={() => markCompleted(o)}
                            className="text-sm bg-[#36F1A2] text-[#235F72] px-3 py-1 rounded hover:bg-[#2dd191] font-medium"
                          >
                            Complete
                          </button>
                        )}
                        {o.status === "completed" && (
                          <button
                            onClick={() => openEntry(o)}
                            className="text-sm bg-[#085DB6] text-white px-3 py-1 rounded hover:bg-[#074a9b] font-medium"
                          >
                            View/Update
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {loading ? "Loading..." : "No test orders found."}
          </div>
        )}
      </div>

      {/* Modal for result entry */}
      {showEntry && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-6xl rounded-xl shadow-lg max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-[#235F72]">
                {selectedOrder.status === "completed"
                  ? "Update Results"
                  : "Enter Results"}{" "}
                • Order #{selectedOrder.id} •{" "}
                {testsById[selectedOrder.test_id]?.name}
              </h3>
              <button
                onClick={closeEntry}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <ResultEntryForm
                order={selectedOrder}
                onClose={closeEntry}
                testParameters={getTestParameters(selectedOrder)}
                testDetails={testsById[selectedOrder.test_id]}
                dynamicQuestionsInfo={getDynamicQuestionsInfo(selectedOrder)}
                findReferenceRange={findReferenceRange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestWorkbench;
