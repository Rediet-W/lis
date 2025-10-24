import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchVisits } from "../../store/slices/visitSlice";
import { useNavigate } from "react-router-dom";

const Visits = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { visits, loading, error } = useSelector((s) => s.visits);

  const [filter, setFilter] = useState("all");

  // Get today's date as YYYY-MM-DD
  const today = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  useEffect(() => {
    const params = { date: today };
    dispatch(fetchVisits(params));
  }, [dispatch, today]);

  const visitsList = Array.isArray(visits) ? visits : visits?.data || [];

  // Local status filter
  const filteredVisits = useMemo(() => {
    if (filter === "all") return visitsList;
    return visitsList.filter((v) => v.status === filter);
  }, [visitsList, filter]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      registered: { color: "bg-blue-100 text-blue-800", label: "Registered" },
      in_progress: {
        color: "bg-orange-100 text-orange-800",
        label: "In Progress",
      },
      sample_collected: {
        color: "bg-purple-100 text-purple-800",
        label: "Sample Collected",
      },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      cancelled: { color: "bg-gray-100 text-gray-800", label: "Cancelled" },
    };
    const cfg = statusConfig[status] || statusConfig.registered;
    return `px-2 py-1 text-xs rounded-full ${cfg.color}`;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      routine: { color: "bg-gray-100 text-gray-800", label: "Routine" },
      urgent: { color: "bg-orange-100 text-orange-800", label: "Urgent" },
      emergency: { color: "bg-red-100 text-red-800", label: "Emergency" },
    };
    const cfg = priorityConfig[priority] || priorityConfig.routine;
    return `px-2 py-1 text-xs rounded-full ${cfg.color}`;
  };

  const formatTime = (t) => {
    if (!t) return "-";
    // Expecting HH:MM:SS or HH:MM; show HH:MM
    return t.slice(0, 5);
  };

  const handleView = (visit) => {
    // navigate(`/receptionist/visits/${visit.id}`, { state: { visit } });
  };

  const handleProcess = (visit) => {
    // Navigate to an order/processing page if needed
    // navigate(`/receptionist/visits/${visit.id}`, { state: { visit } });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#235F72]">Today's Visits</h1>
        <p className="text-gray-600">
          Manage patient visits for {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {String(error)}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-[#235F72]">
            {visitsList.length}
          </div>
          <div className="text-gray-600 text-sm">Total Visits</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {visitsList.filter((v) => v.status === "completed").length}
          </div>
          <div className="text-gray-600 text-sm">Completed</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {visitsList.filter((v) => v.status === "in_progress").length}
          </div>
          <div className="text-gray-600 text-sm">In Progress</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {visitsList.filter((v) => v.status === "registered").length}
          </div>
          <div className="text-gray-600 text-sm">Registered</div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              filter === "all"
                ? "bg-[#235F72] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Visits
          </button>
          <button
            onClick={() => setFilter("registered")}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              filter === "registered"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Registered
          </button>
          <button
            onClick={() => setFilter("in_progress")}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              filter === "in_progress"
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg transition duration-200 ${
              filter === "completed"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Visits Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-600">
            Loading visits...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                      Patient
                    </th>
                    <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                      Time
                    </th>
                    <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                      Priority
                    </th>
                    <th className="text-left py-4 px-6 text-[#235F72] font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisits.map((visit) => {
                    const patientName =
                      visit.patient_name ||
                      visit.full_name ||
                      `Patient #${visit.patient_id}`;
                    const cardNumber = visit.card_number
                      ? `(${visit.card_number})`
                      : "";
                    return (
                      <tr
                        key={visit.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-6">
                          <div className="font-medium text-[#235F72]">
                            {patientName}{" "}
                            <span className="text-gray-500 font-normal">
                              {cardNumber}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-700">
                            {formatTime(visit.visit_time)}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={getPriorityBadge(visit.priority)}>
                            {visit.priority}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={getStatusBadge(visit.status)}>
                            {(visit.status || "").replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredVisits.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Visits Found
                </h3>
                <p className="text-gray-500">
                  No visits match your filter criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Visits;
