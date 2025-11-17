import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPathologistReport,
  updatePathologistReport,
  fetchPathologistReportById,
} from "../../store/slices/pathologistResultSlice";
import { fetchTestOrders } from "../../store/slices/testOrderSlice";

const PathologistReportForm = ({ report = null, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.pathologistReports || {});
  const { user } = useSelector((state) => state.auth || {});
  const { testOrders } = useSelector((s) => s.testOrders || {});

  const orders = useMemo(
    () => (Array.isArray(testOrders) ? testOrders : testOrders?.data || []),
    [testOrders]
  );
  const [form, setForm] = useState({
    test_order_id: report?.test_order_id || "",
    pathologist_id: user?.id || "",
    images: report?.images ? JSON.stringify(report.images) : "[]",
    overall_comments: report?.overall_comments || "",
    status: report?.status || "draft",
    is_verified: report?.is_verified ? true : false,
    verified_by: report?.verified_by || null,
  });

  // Key-value pairs state for report data
  const [keyValuePairs, setKeyValuePairs] = useState([{ key: "", value: "" }]);

  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(fetchTestOrders());
    }
    if (report?.id) dispatch(fetchPathologistReportById(report.id));
  }, [report, dispatch, orders]);

  // Initialize key-value pairs from existing report data
  useEffect(() => {
    if (report?.report_data) {
      try {
        const reportData =
          typeof report.report_data === "string"
            ? JSON.parse(report.report_data)
            : report.report_data;

        const pairs = Object.entries(reportData).map(([key, value]) => ({
          key,
          value: String(value),
        }));

        setKeyValuePairs(pairs.length > 0 ? pairs : [{ key: "", value: "" }]);
      } catch (error) {
        console.error("Error parsing report data:", error);
        setKeyValuePairs([{ key: "", value: "" }]);
      }
    }
  }, [report]);

  // Convert key-value pairs to JSON
  const convertToJSON = (pairs) => {
    const jsonData = {};
    pairs.forEach((pair) => {
      if (pair.key.trim() !== "") {
        jsonData[pair.key.trim()] = pair.value;
      }
    });
    return jsonData;
  };

  const handleKeyValueChange = (index, field, value) => {
    const updatedPairs = [...keyValuePairs];
    updatedPairs[index][field] = value;
    setKeyValuePairs(updatedPairs);
  };

  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: "", value: "" }]);
  };

  const removeKeyValuePair = (index) => {
    if (keyValuePairs.length > 1) {
      const updatedPairs = keyValuePairs.filter((_, i) => i !== index);
      setKeyValuePairs(updatedPairs);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const reportData = convertToJSON(keyValuePairs);

      const payload = {
        test_order_id: form.test_order_id,
        pathologist_id: user?.id || form.pathologist_id,
        report_data: reportData,
        images: form.images ? JSON.parse(form.images) : null,
        overall_comments: form.overall_comments || null,
        status: form.status,
        is_verified: form.is_verified ? 1 : 0,
        verified_by: form.verified_by || null,
      };

      if (report?.id) {
        await dispatch(
          updatePathologistReport({ id: report.id, data: payload })
        ).unwrap();
      } else {
        await dispatch(createPathologistReport(payload)).unwrap();
      }
      onClose?.();
    } catch (err) {
      console.error("Save failed", err);
      alert(err || "Failed to save report");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 h-[80vh] overflow-y-auto p-4"
    >
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {report ? "Edit Pathologist Report" : "New Pathologist Report"}
        </h2>
        <p className="text-gray-600 mt-1">
          {report
            ? "Update the existing report"
            : "Create a new pathology report"}
        </p>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Order *
          </label>

          <select
            required
            value={form.test_order_id}
            onChange={(e) =>
              setForm({ ...form, test_order_id: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#235F72] focus:border-transparent transition-all"
          >
            <option value="">-- Select test order --</option>
            {orders.map((o) => {
              const labelParts = [];
              labelParts.push(`#${o.id}`);
              if (o.patient_name) labelParts.push(o.patient_name);
              if (o.test_name) labelParts.push(o.test_name);
              if (o.card_number) labelParts.push(`(${o.card_number})`);
              const label = labelParts.join(" • ");
              return (
                <option key={o.id} value={o.id}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Key-Value Pairs for Report Data */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Test Results *
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Add test names and their detailed results
            </p>
          </div>
          <button
            type="button"
            onClick={addKeyValuePair}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Test
          </button>
        </div>

        <div className="space-y-3">
          {keyValuePairs.map((pair, index) => (
            <div
              key={index}
              className="flex gap-3 items-start bg-white p-3 rounded-lg border"
            >
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Test Name
                </label>
                <input
                  type="text"
                  value={pair.key}
                  onChange={(e) =>
                    handleKeyValueChange(index, "key", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#235F72] focus:border-transparent text-sm"
                  placeholder="e.g., Hemoglobin, White Blood Cells, Microscopic Findings"
                />
              </div>
              <div className="flex-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Result Description
                </label>
                <textarea
                  value={pair.value}
                  onChange={(e) =>
                    handleKeyValueChange(index, "value", e.target.value)
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#235F72] focus:border-transparent text-sm"
                  placeholder="Enter detailed findings and interpretation..."
                />
              </div>
              <button
                type="button"
                onClick={() => removeKeyValuePair(index)}
                className="mt-6 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={keyValuePairs.length === 1}
                title={
                  keyValuePairs.length === 1
                    ? "At least one test is required"
                    : "Remove test"
                }
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* JSON Preview (Collapsible) */}
        <details className="mt-4 border border-gray-200 rounded-lg">
          <summary className="px-4 py-2 bg-white cursor-pointer font-medium text-gray-700 text-sm">
            JSON Preview (Auto-generated)
          </summary>
          <div className="p-3 bg-gray-900 text-green-400 font-mono text-xs rounded-b-lg max-h-40 overflow-auto">
            <pre>{JSON.stringify(convertToJSON(keyValuePairs), null, 2)}</pre>
          </div>
        </details>
      </div>

      {/* Images Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Images
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              // Handle image upload logic here
              const files = Array.from(e.target.files);
              const imageUrls = files.map((file) => URL.createObjectURL(file));
              setForm({ ...form, images: JSON.stringify(imageUrls) });
            }}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer block">
            <div className="text-gray-400 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-600">Click to upload images</p>
            <p className="text-sm text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB
            </p>
          </label>
        </div>
      </div>

      {/* Comments and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overall Comments & Interpretation
          </label>
          <textarea
            rows={4}
            value={form.overall_comments}
            onChange={(e) =>
              setForm({ ...form, overall_comments: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#235F72] focus:border-transparent transition-all"
            placeholder="Add overall comments, clinical correlation, and final interpretation..."
          />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#235F72] focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="verified">Verified</option>
            </select>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="verified"
              checked={form.is_verified}
              onChange={(e) =>
                setForm({ ...form, is_verified: e.target.checked })
              }
              className="w-4 h-4 text-[#235F72] border-gray-300 rounded focus:ring-[#235F72]"
            />
            <label htmlFor="verified" className="ml-2 text-sm text-gray-700">
              Mark as verified by pathologist
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={
            loading ||
            !form.test_order_id ||
            keyValuePairs.every((pair) => !pair.key.trim())
          }
          className="px-6 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {report ? "Update Report" : "Create Report"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PathologistReportForm;
