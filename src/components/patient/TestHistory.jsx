import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTestOrders } from "../../store/slices/testOrderSlice";
import { fetchTests } from "../../store/slices/testSlice";
import visitService from "../../services/visitService";
import api from "../../services/api";

const TestHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((s) => s.auth || {});
  const {
    testOrders,
    loading: ordersLoading,
    error,
  } = useSelector((s) => s.testOrders || {});
  const { tests } = useSelector((s) => s.tests || { tests: [] });

  const [visitsSet, setVisitsSet] = useState(new Set());
  const [visitsLoading, setVisitsLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Normalize redux payloads
  const ordersList = useMemo(() => {
    if (Array.isArray(testOrders)) return testOrders;
    return testOrders?.data || [];
  }, [testOrders]);

  const testsById = useMemo(() => {
    const list = Array.isArray(tests) ? tests : tests?.data || [];
    return Object.fromEntries(list.map((t) => [t.id, t]));
  }, [tests]);

  const resolvePatientId = async () => {
    if (user?.patient_id) return user.patient_id;
    const res = await api.get("/patients/me");
    const me = res?.data?.data ?? res?.data;
    return me?.id;
  };

  useEffect(() => {
    // Fetch all orders for filtering client-side and tests for names
    dispatch(fetchTestOrders({}));
    if (!Array.isArray(tests) || tests.length === 0) {
      dispatch(fetchTests());
    }
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setVisitsLoading(true);
        const pid = await resolvePatientId();
        if (!pid) {
          if (mounted) setVisitsSet(new Set());
          return;
        }
        // Fetch only the visits for this patient (server-side filtered)
        const vRes = await visitService.getAllVisits({ patient_id: pid });
        const visits = vRes?.data?.data ?? vRes?.data ?? [];
        const ids = new Set(visits.map((v) => v.id));
        if (mounted) setVisitsSet(ids);
      } finally {
        if (mounted) setVisitsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.patient_id]);

  // Keep only orders whose visit_id belongs to this patient's visits
  const myOrders = useMemo(() => {
    if (!visitsSet || visitsSet.size === 0) return [];
    return ordersList
      .filter((o) => visitsSet.has(o.visit_id))
      .map((o) => ({
        ...o,
        test_name: testsById[o.test_id]?.name || `Test #${o.test_id}`,
      }))
      .sort(
        (a, b) => new Date(b.ordered_at || 0) - new Date(a.ordered_at || 0)
      );
  }, [ordersList, visitsSet, testsById]);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return myOrders.filter((o) => {
      const statusOk = statusFilter === "all" || o.status === statusFilter;
      if (!s) return statusOk;
      const testName = (o.test_name || "").toLowerCase();
      return statusOk && (testName.includes(s) || String(o.id).includes(s));
    });
  }, [myOrders, statusFilter, search]);

  const isLoading = ordersLoading || visitsLoading;

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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        {/* <button
          className="flex items-center text-[#085DB6] hover:text-[#074a9b] mb-4"
          onClick={() => navigate(-1)}
        >
          <span className="mr-2">←</span> Back
        </button>
        <h1 className="text-2xl font-bold text-[#235F72]">Test History</h1> */}
        <p className="text-gray-600">
          View your laboratory test orders and results
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {String(error)}
        </div>
      )}

      {/* Filters (like TestOrdersList) */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by order ID or test name"
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
            {ordersLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Table (mirrors TestOrdersList without Patient column) */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
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
                        <td className="py-4 px-6">{o.test_name}</td>
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
                          <button
                            onClick={() => navigate(`/print-report/${o.id}`)}
                            className={`text-sm font-medium ${
                              o.status === "completed"
                                ? "text-[#085DB6] hover:text-[#074a9b]"
                                : "text-gray-400"
                            }`}
                            disabled={o.status !== "completed"}
                          >
                            View Results
                          </button>
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
    </div>
  );
};

export default TestHistory;
