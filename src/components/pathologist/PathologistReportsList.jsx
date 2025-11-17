import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPathologistReports,
  fetchPathologistReportById,
  deletePathologistReport,
} from "../../store/slices/pathologistResultSlice";
import PathologistReportView from "./PathologistReportView";
import PathologistReportForm from "./PathologistReportForm";

const PathologistReportsList = () => {
  const dispatch = useDispatch();
  const { reports, loading, error } = useSelector(
    (s) => s.pathologistReports || {}
  );
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  useEffect(() => {
    dispatch(fetchPathologistReports());
  }, [dispatch]);

  const openView = async (r) => {
    await dispatch(fetchPathologistReportById(r.id)).unwrap();
    setShowView(true);
  };

  const openForm = (r = null) => {
    setSelected(r);
    setShowForm(true);
  };

  const handleDelete = (r) => {
    if (!window.confirm("Delete this report?")) return;
    dispatch(deletePathologistReport(r.id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Pathologist Reports</h2>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(fetchPathologistReports())}
            className="btn"
          >
            Refresh
          </button>
          <button
            onClick={() => openForm(null)}
            className="btn bg-[#235F72] text-white p-2 rounded-md"
          >
            New Report
          </button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-3">{String(error)}</div>}

      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Patient</th>
              <th className="p-2">Test</th>
              <th className="p-2">Pathologist</th>
              <th className="p-2">Status</th>
              <th className="p-2">Created</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(reports) ? reports : []).map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2">#{r.id}</td>
                <td className="p-2">
                  {r.patient_name || r.patient_name || "-"}
                </td>
                <td className="p-2">{r.test_name || "-"}</td>
                <td className="p-2">{r.pathologist_name || "-"}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openView(r)}
                      className="text-sm text-blue-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openForm(r)}
                      className="text-sm text-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(r)}
                      className="text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {(!reports || reports.length === 0) && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">
                {selected ? "Edit Report" : "New Report"}
              </h3>
              <button onClick={() => setShowForm(false)}>✕</button>
            </div>
            <PathologistReportForm
              report={selected}
              onClose={() => {
                setShowForm(false);
                dispatch(fetchPathologistReports());
              }}
            />
          </div>
        </div>
      )}

      {showView && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Report #{selected?.id}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-[#235F72] text-white rounded"
                >
                  Print
                </button>
                <button onClick={() => setShowView(false)}>✕</button>
              </div>
            </div>
            <PathologistReportView />
          </div>
        </div>
      )}
    </div>
  );
};

export default PathologistReportsList;
