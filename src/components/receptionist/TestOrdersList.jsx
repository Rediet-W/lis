import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTestOrders,
  fetchTestOrderResults,
} from "../../store/slices/testOrderSlice";
import { fetchTests } from "../../store/slices/testSlice";
import { toast } from "react-toastify";

const TestOrdersList = () => {
  const dispatch = useDispatch();
  const { testOrders, testOrderResults, loading, error } = useSelector(
    (s) => s.testOrders
  );
  const { tests } = useSelector((s) => s.tests || { tests: [] });

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    dispatch(fetchTestOrders({}));
    if (!Array.isArray(tests) || tests.length === 0) {
      dispatch(fetchTests());
    }
  }, [dispatch]);

  // Normalize payloads to arrays
  const ordersList = useMemo(() => {
    if (Array.isArray(testOrders)) return testOrders;
    return testOrders?.data || [];
  }, [testOrders]);

  const testsById = useMemo(() => {
    const list = Array.isArray(tests) ? tests : tests?.data || [];
    return Object.fromEntries(list.map((t) => [t.id, t]));
  }, [tests]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return ordersList.filter((o) => {
      const statusOk = statusFilter === "all" || o.status === statusFilter;
      if (!s) return statusOk;
      const name = (o.patient_name || o.full_name || "").toLowerCase();
      const card = (o.card_number || "").toLowerCase();
      const testName = (testsById[o.test_id]?.name || "").toLowerCase();
      return (
        statusOk &&
        (name.includes(s) ||
          card.includes(s) ||
          String(o.id).includes(s) ||
          testName.includes(s))
      );
    });
  }, [ordersList, statusFilter, search, testsById]);

  const getStatusBadge = (status) => {
    const map = {
      ordered: "bg-blue-100 text-blue-800",
      sample_collected: "bg-purple-100 text-purple-800",
      in_progress: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-gray-100 text-gray-700",
    };
    return `px-2 py-1 text-xs rounded-full ${
      map[status] || "bg-gray-100 text-gray-700"
    }`;
  };

  const getPriorityBadge = (priority) => {
    const map = {
      normal: "bg-gray-100 text-gray-800",
      urgent: "bg-red-100 text-red-700",
    };
    return `px-2 py-1 text-xs rounded-full ${
      map[priority] || "bg-gray-100 text-gray-800"
    }`;
  };

  const openResults = async (order) => {
    try {
      setSelectedOrder(order);
      await dispatch(fetchTestOrderResults(order.id)).unwrap();
      setShowResults(true);
    } catch (e) {
      toast.error(typeof e === "string" ? e : "Failed to fetch results");
    }
  };
  const openPrint = (order) => {
    // Open new window for printing
    const printWindow = window.open(
      `/print-report?orderId=${order.id}`,
      "_blank",
      "width=1200,height=800,scrollbars=yes"
    );

    setTimeout(() => {
      if (printWindow) {
        printWindow.focus();
        // The print will be triggered from the new window component
      }
    }, 1000);
  };
  const closeResults = () => {
    setSelectedOrder(null);
    setShowResults(false);
  };

  const resultsList = useMemo(() => {
    if (Array.isArray(testOrderResults)) return testOrderResults;
    return testOrderResults?.data || [];
  }, [testOrderResults]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#235F72]">Test Orders</h1>
        <p className="text-gray-600">View and manage all test orders</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {String(error)}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by order ID, patient name, card number, or test name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "all",
              "ordered",
              "sample_collected",
              "in_progress",
              "completed",
              "cancelled",
            ].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg transition ${
                  statusFilter === s
                    ? "bg-[#235F72] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
          <button
            onClick={() => dispatch(fetchTestOrders({}))}
            className="px-4 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a]"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-600">
            Loading orders...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                      Order #
                    </th>
                    <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                      Patient
                    </th>
                    <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                      Test
                    </th>
                    <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                      Priority
                    </th>
                    <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                      Ordered At
                    </th>
                    <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => {
                    const testName =
                      testsById[o.test_id]?.name || `Test #${o.test_id}`;
                    const patientName =
                      o.patient_name ||
                      o.full_name ||
                      `Patient #${o.patient_id || "-"}`;
                    const card = o.card_number ? `(${o.card_number})` : "";
                    const orderedAt = o.ordered_at
                      ? new Date(o.ordered_at).toLocaleString()
                      : "-";
                    return (
                      <tr
                        key={o.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-6 font-semibold text-[#235F72]">
                          #{o.id}
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-800">
                            {patientName}{" "}
                            <span className="text-gray-500">{card}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Visit: {o.visit_id}
                          </div>
                        </td>
                        <td className="py-4 px-6">{testName}</td>
                        <td className="py-4 px-6">
                          <span className={getPriorityBadge(o.priority)}>
                            {o.priority}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={getStatusBadge(o.status)}>
                            {o.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-4 px-6">{orderedAt}</td>
                        <td className="py-4 px-6">
                          <div className="flex gap-3">
                            <button
                              disabled={o.status !== "completed"}
                              onClick={() => openResults(o)}
                              className={`text-sm font-medium ${
                                o.status === "completed"
                                  ? "text-[#085DB6] hover:text-[#074a9b]"
                                  : "text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              View Results
                            </button>
                            <button
                              onClick={() => openPrint(o)}
                              className="text-sm font-medium text-[#085DB6] hover:text-[#074a9b]"
                            >
                              Print
                            </button>
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
                No test orders found.
              </div>
            )}
          </>
        )}
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#235F72]">
                Test Results for Order #{selectedOrder?.id}
              </h3>
              <button
                onClick={closeResults}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-gray-600">
                Loading results...
              </div>
            ) : resultsList.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                No results available.
              </div>
            ) : (
              <div className="space-y-3">
                {resultsList.map((r) => (
                  <div
                    key={r.id}
                    className="border rounded-lg p-3 flex justify-between items-start"
                  >
                    <div>
                      <div className="text-sm text-gray-700">
                        Value:{" "}
                        <span className="font-semibold">
                          {r.result_value || r.numeric_value || "-"}
                        </span>{" "}
                        {r.unit ? (
                          <span className="text-gray-500">{r.unit}</span>
                        ) : null}
                      </div>
                      {r.comments && (
                        <div className="text-xs text-gray-500 mt-1">
                          Comments: {r.comments}
                        </div>
                      )}
                      {r.interpretation && (
                        <div className="text-xs text-gray-500">
                          Interpretation: {r.interpretation}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1">
                        Verified: {r.is_verified ? "Yes" : "No"}{" "}
                        {r.verified_at
                          ? `(${new Date(r.verified_at).toLocaleString()})`
                          : ""}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        r.status === "high"
                          ? "bg-red-100 text-red-700"
                          : r.status === "low"
                          ? "bg-yellow-100 text-yellow-700"
                          : r.status === "critical"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-right">
              <button
                onClick={closeResults}
                className="px-6 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestOrdersList;
