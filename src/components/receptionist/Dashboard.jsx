import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchVisits } from "../../store/slices/visitSlice";
import { fetchTestOrders } from "../../store/slices/testOrderSlice";

const ReceptionistDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Visits slice
  const {
    visits,
    loading: visitsLoading,
    error: visitsError,
  } = useSelector(
    (s) => s.visits || { visits: [], loading: false, error: null }
  );
  const visitsList = useMemo(
    () => (Array.isArray(visits) ? visits : visits?.data || []),
    [visits]
  );

  // Test orders slice
  const {
    testOrders,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector(
    (s) => s.testOrders || { testOrders: [], loading: false, error: null }
  );
  const ordersList = useMemo(
    () => (Array.isArray(testOrders) ? testOrders : testOrders?.data || []),
    [testOrders]
  );

  // Fetch today's visits and all test orders on mount
  useEffect(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const today = `${yyyy}-${mm}-${dd}`;

    dispatch(fetchVisits({ date: today })); // server-side filter for today if supported
    dispatch(fetchTestOrders({})); // add params if backend supports filtering
  }, [dispatch]);

  // Stats
  const todayPatients = useMemo(() => {
    const set = new Set((visitsList || []).map((v) => v.patient_id));
    return set.size;
  }, [visitsList]);

  const pendingTests = useMemo(
    () =>
      (ordersList || []).filter((o) =>
        ["ordered", "sample_collected", "in_progress"].includes(o.status)
      ).length,
    [ordersList]
  );

  const resultsReady = useMemo(
    () => (ordersList || []).filter((o) => o.status === "completed").length,
    [ordersList]
  );

  // Recent patients from today's visits (unique, latest first)
  const recentPatients = useMemo(() => {
    const byPatient = new Map();
    (visitsList || [])
      .slice()
      .sort((a, b) => String(b.visit_time).localeCompare(String(a.visit_time)))
      .forEach((v) => {
        if (!byPatient.has(v.patient_id)) byPatient.set(v.patient_id, v);
      });
    return Array.from(byPatient.values()).slice(0, 5);
  }, [visitsList]);

  const formatTime = (t) => (!t ? "-" : String(t).slice(0, 5));

  const handleViewPatient = (v) => {
    if (v.patient_id) {
      navigate(`/receptionist/patient-details/${v.patient_id}`, {
        state: { from: "dashboard" },
      });
    }
  };

  const isLoading = visitsLoading || ordersLoading;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <div className="space-y-6">
            {/* Errors */}
            {(visitsError || ordersError) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {visitsError ? String(visitsError) : null}
                {ordersError ? ` | ${String(ordersError)}` : null}
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#36F1A2]">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#36F1A2] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {isLoading ? "…" : todayPatients}
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600">Today Patients</p>
                    <p className="text-2xl font-bold text-[#235F72]">
                      {isLoading ? "Loading..." : todayPatients}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#085DB6]">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#085DB6] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {isLoading ? "…" : pendingTests}
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600">Pending Tests</p>
                    <p className="text-2xl font-bold text-[#235F72]">
                      {isLoading ? "Loading..." : pendingTests}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-[#235F72]">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#235F72] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {isLoading ? "…" : resultsReady}
                  </div>
                  <div className="ml-4">
                    <p className="text-gray-600">Results Ready</p>
                    <p className="text-2xl font-bold text-[#235F72]">
                      {isLoading ? "Loading..." : resultsReady}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#235F72]">
                  Quick Actions
                </h2>
                <button
                  onClick={() => {
                    // refresh dashboard data
                    const d = new Date();
                    const yyyy = d.getFullYear();
                    const mm = String(d.getMonth() + 1).padStart(2, "0");
                    const dd = String(d.getDate()).padStart(2, "0");
                    dispatch(fetchVisits({ date: `${yyyy}-${mm}-${dd}` }));
                    dispatch(fetchTestOrders({}));
                  }}
                  className="px-4 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a]"
                >
                  {isLoading ? "Refreshing..." : "Refresh"}
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate("/receptionist/register-patient")}
                  className="bg-[#36F1A2] text-[#235F72] p-4 rounded-lg text-center hover:bg-[#2dd191] transition duration-200 font-semibold"
                >
                  Register Patient
                </button>
                <button
                  onClick={() => navigate("/receptionist/test-orders")}
                  className="bg-[#085DB6] text-white p-4 rounded-lg text-center hover:bg-[#074a9b] transition duration-200 font-semibold"
                >
                  Order Tests
                </button>
                <button
                  onClick={() => navigate("/receptionist/visits")}
                  className="bg-[#235F72] text-white p-4 rounded-lg text-center hover:bg-[#1a4a5a] transition duration-200 font-semibold"
                >
                  Today’s Visits
                </button>
                <button
                  onClick={() => navigate("/receptionist/test-order-list")}
                  className="bg-white border-2 border-[#36F1A2] text-[#235F72] p-4 rounded-lg text-center hover:bg-[#36F1A2] transition duration-200 font-semibold"
                >
                  Test Orders
                </button>
              </div>
            </div>

            {/* Recent Patients (today’s visits) */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-[#235F72] mb-4">
                Recent Patients
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 text-[#235F72]">Name</th>
                      <th className="text-left py-3 text-[#235F72]">
                        Card No.
                      </th>
                      <th className="text-left py-3 text-[#235F72]">Time</th>
                      <th className="text-left py-3 text-[#235F72]">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPatients.map((v) => {
                      const name =
                        v.patient_name ||
                        v.full_name ||
                        `Patient #${v.patient_id}`;
                      const card = v.card_number || "-";
                      return (
                        <tr
                          key={`${v.id}-${v.patient_id}`}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3">{name}</td>
                          <td className="py-3">{card}</td>
                          <td className="py-3">{formatTime(v.visit_time)}</td>
                          <td className="py-3">
                            <button
                              onClick={() => handleViewPatient(v)}
                              className="text-[#085DB6] hover:text-[#074a9b] font-medium"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {recentPatients.length === 0 && (
                      <tr>
                        <td
                          className="py-6 text-center text-gray-500"
                          colSpan={4}
                        >
                          {isLoading ? "Loading..." : "No patients yet today."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
