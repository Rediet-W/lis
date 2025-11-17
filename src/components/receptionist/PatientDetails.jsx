import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import {
  fetchPatientById,
  updatePatient,
} from "../../store/slices/patientSlice";
import { fetchVisits } from "../../store/slices/visitSlice";
import {
  fetchTestOrders,
  fetchTestOrderResults,
} from "../../store/slices/testOrderSlice";
import { fetchTests } from "../../store/slices/testSlice";

const PatientDetails = () => {
  const { id } = useParams();
  const patientId = Number(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Slices
  const {
    currentPatient,
    loading: patientLoading,
    error: patientError,
  } = useSelector((s) => s.patients || {});
  console.log(currentPatient, id);
  const { visits, loading: visitsLoading } = useSelector((s) => s.visits || {});
  const {
    testOrders,
    testOrderResults,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((s) => s.testOrders || {});
  const { tests, loading: testsLoading } = useSelector((s) => s.tests || {});

  // Local state
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch on mount
  useEffect(() => {
    if (!Number.isFinite(patientId)) return;
    dispatch(fetchPatientById(patientId));
    // Fetch all visits for this patient (no date filter to get history)
    dispatch(fetchVisits({ patient_id: patientId }));
    // Fetch all test orders then filter by this patient's visits client-side
    dispatch(fetchTestOrders({}));
    // Ensure tests are present to resolve test names
    dispatch(fetchTests());
  }, [dispatch, patientId]);

  // Initialize form when patient loads
  useEffect(() => {
    if (!currentPatient) return;
    setFormData({
      full_name: currentPatient.full_name || "",
      phone: currentPatient.phone || "",
      age: currentPatient.age || "",

      gender: currentPatient.gender || "",
      address: currentPatient.address || "",
      emergency_contact: currentPatient.emergency_contact || "",
      email: currentPatient.email || "",
      blood_type: currentPatient.blood_type || "unknown",
      known_allergies: currentPatient.known_allergies || "",
      chronic_conditions: currentPatient.chronic_conditions || "",
      current_medications: currentPatient.current_medications || "",
    });
  }, [currentPatient]);

  const visitsList = useMemo(
    () => (Array.isArray(visits) ? visits : visits?.data || []),
    [visits]
  );
  const ordersList = useMemo(
    () => (Array.isArray(testOrders) ? testOrders : testOrders?.data || []),
    [testOrders]
  );
  const testsById = useMemo(() => {
    const list = Array.isArray(tests) ? tests : tests?.data || [];
    return Object.fromEntries(list.map((t) => [t.id, t]));
  }, [tests]);

  // Build set of this patient's visit IDs
  const patientVisitIds = useMemo(() => {
    const set = new Set();
    (visitsList || []).forEach((v) => {
      if (v.patient_id === patientId) set.add(v.id);
    });
    return set;
  }, [visitsList, patientId]);

  // Orders belonging to this patient (orders with visit_id in patient's visits)
  const patientOrders = useMemo(
    () => (ordersList || []).filter((o) => patientVisitIds.has(o.visit_id)),
    [ordersList, patientVisitIds]
  );

  // Group orders by visit and sort recent first
  const ordersByVisit = useMemo(() => {
    const byVisit = new Map();
    patientOrders.forEach((o) => {
      const arr = byVisit.get(o.visit_id) || [];
      arr.push(o);
      byVisit.set(o.visit_id, arr);
    });
    // build entries with visit meta
    const entries = Array.from(byVisit.entries()).map(([visit_id, orders]) => {
      const v = visitsList.find((vv) => vv.id === visit_id);
      return {
        visit_id,
        visit_date: v?.visit_date,
        visit_time: v?.visit_time,
        status: v?.status,
        orders: orders.sort((a, b) =>
          String(b.ordered_at || "").localeCompare(String(a.ordered_at || ""))
        ),
      };
    });
    // sort by visit date/time desc
    return entries.sort((a, b) => {
      const aKey = `${a.visit_date || ""} ${a.visit_time || ""}`;
      const bKey = `${b.visit_date || ""} ${b.visit_time || ""}`;
      return bKey.localeCompare(aKey);
    });
  }, [patientOrders, visitsList]);

  const isBusy =
    patientLoading || visitsLoading || ordersLoading || testsLoading;

  const calculateAge = (dateStr) => {
    if (!dateStr) return "N/A";
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/receptionist/patient-search");
  };

  const handleAssignTests = () => {
    if (!currentPatient) return;
    navigate("/receptionist/test-orders", {
      state: { patient: currentPatient, from: "patient-details" },
    });
  };

  const handleSave = async () => {
    if (!formData || !currentPatient?.id) return;
    try {
      const payload = {
        ...formData,
        // Keep date format acceptable by backend if it expects date string
        age: formData.age || null,
      };
      const updated = await dispatch(
        updatePatient({ id: currentPatient.id, patientData: payload })
      ).unwrap();
      toast.success("Patient updated successfully");
      setIsEditing(false);
      // refresh current patient
      dispatch(fetchPatientById(currentPatient.id));
    } catch (e) {
      const msg = typeof e === "string" ? e : "Failed to update patient";
      toast.error(msg);
    }
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

  const closeResults = () => {
    setSelectedOrder(null);
    setShowResults(false);
  };

  const resultsList = useMemo(() => {
    if (Array.isArray(testOrderResults)) return testOrderResults;
    return testOrderResults?.data || [];
  }, [testOrderResults]);

  const statusPill = (status) => {
    const map = {
      ordered: "bg-blue-100 text-blue-800",
      sample_collected: "bg-purple-100 text-purple-800",
      in_progress: "bg-orange-100 text-orange-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-gray-100 text-gray-700",
    };
    return `inline-flex items-center px-2 py-1 text-xs rounded-full ${
      map[status] || "bg-gray-100 text-gray-700"
    }`;
  };

  const formatTime = (t) => (!t ? "-" : String(t).slice(0, 5));

  // Prepare fields for rendering
  const cardNumber = currentPatient?.card_number || "-";
  const fullName = currentPatient?.full_name || "-";

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={handleBack}
              className="flex items-center text-[#085DB6] hover:text-[#074a9b] mb-2"
            >
              <span className="mr-2">←</span>
              Back
            </button>
            <h1 className="text-2xl font-bold text-[#235F72]">
              Patient Details: {fullName}
            </h1>
            <p className="text-gray-600">Card: {cardNumber}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsEditing((v) => !v)}
              className="bg-[#36F1A2] text-[#235F72] px-6 py-2 rounded-lg hover:bg-[#2dd191] transition duration-200 font-semibold"
            >
              {isEditing ? "Cancel Edit" : "Edit Information"}
            </button>
            {!isEditing && (
              <button
                onClick={handleAssignTests}
                className="bg-[#235F72] text-white px-6 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold"
              >
                Assign New Tests
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          {[
            { id: "profile", label: "Profile Information" },
            { id: "history", label: "Test History" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 font-medium transition duration-200 ${
                activeTab === tab.id
                  ? "border-b-2 border-[#235F72] text-[#235F72]"
                  : "text-gray-500 hover:text-[#235F72]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            {patientError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {String(patientError)}
              </div>
            )}

            {!formData ? (
              <div className="text-gray-600">
                {isBusy ? "Loading..." : "No data"}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      disabled
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={formData.age || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          age: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Type
                    </label>
                    <select
                      value={formData.blood_type || "unknown"}
                      onChange={(e) =>
                        setFormData({ ...formData, blood_type: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    >
                      {[
                        "A+",
                        "A-",
                        "B+",
                        "B-",
                        "AB+",
                        "AB-",
                        "O+",
                        "O-",
                        "unknown",
                      ].map((bt) => (
                        <option key={bt} value={bt}>
                          {bt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact
                    </label>
                    <input
                      type="tel"
                      value={formData.emergency_contact}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergency_contact: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Known Allergies
                    </label>
                    <input
                      type="text"
                      value={formData.known_allergies}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          known_allergies: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chronic Conditions
                    </label>
                    <input
                      type="text"
                      value={formData.chronic_conditions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          chronic_conditions: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Medications
                    </label>
                    <input
                      type="text"
                      value={formData.current_medications}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          current_medications: e.target.value,
                        })
                      }
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={patientLoading}
                      className="px-6 py-3 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold disabled:opacity-50"
                    >
                      {patientLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Test History Tab */}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Laboratory Test History
            </h3>

            {ordersError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                {String(ordersError)}
              </div>
            )}

            {isBusy ? (
              <div className="text-center py-8 text-gray-600">
                Loading history...
              </div>
            ) : ordersByVisit.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>No test history available.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {ordersByVisit.map((item) => (
                  <div
                    key={item.visit_id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#36F1A2] transition duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-[#235F72]">
                          {item.visit_date
                            ? new Date(item.visit_date).toLocaleDateString()
                            : "Visit"}
                          {item.visit_time
                            ? ` • ${formatTime(item.visit_time)}`
                            : ""}
                        </h4>
                        {item.status && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full border border-gray-200">
                            {item.status.replace("_", " ")}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Visit ID: {item.visit_id}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {item.orders.map((o) => {
                        const testName =
                          testsById[o.test_id]?.name || `Test #${o.test_id}`;
                        return (
                          <div
                            key={o.id}
                            className="flex items-center justify-between py-2 border-b last:border-b-0"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-gray-800">
                                  {testName}
                                </span>
                                <span className={statusPill(o.status)}>
                                  {o.status.replace("_", " ")}
                                </span>
                                {o.priority && (
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      o.priority === "urgent"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {o.priority}
                                  </span>
                                )}
                              </div>
                              {o.ordered_at && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Ordered:{" "}
                                  {new Date(o.ordered_at).toLocaleString()}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
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
                                disabled={o.status !== "completed"}
                                onClick={() =>
                                  navigate(`/print-report?order=${o.id}`)
                                }
                                className={`text-sm font-medium ${
                                  o.status === "completed"
                                    ? "text-[#235F72] hover:text-[#1a4a5a]"
                                    : "text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                Print Report
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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

            {ordersLoading ? (
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

export default PatientDetails;
