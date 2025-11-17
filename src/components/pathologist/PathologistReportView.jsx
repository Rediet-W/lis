import React from "react";
import { useSelector } from "react-redux";

const PathologistReportView = () => {
  const { currentReport } = useSelector((s) => s.pathologistReports || {});
  if (!currentReport) return <div className="p-4">No report loaded.</div>;

  let reportData = {};
  try {
    reportData =
      typeof currentReport.report_data === "string"
        ? JSON.parse(currentReport.report_data)
        : currentReport.report_data || {};
  } catch {
    reportData = currentReport.report_data || {};
  }

  const images = (() => {
    try {
      return typeof currentReport.images === "string"
        ? JSON.parse(currentReport.images)
        : currentReport.images || [];
    } catch {
      return [];
    }
  })();

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Report #{currentReport.id}</h3>
      <div className="mb-3 text-sm text-gray-600">
        Patient: {currentReport.patient_name} • Card:{" "}
        {currentReport.card_number} • Age/Gender: {currentReport.patient_age}/
        {currentReport.patient_gender}
      </div>

      <div className="mb-4">
        <strong>Test:</strong> {currentReport.test_name} •{" "}
        <strong>Category:</strong> {currentReport.category_name}
      </div>

      <div className="mb-4">
        <strong>Report Data</strong>
        <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
          {JSON.stringify(reportData, null, 2)}
        </pre>
      </div>

      {images.length > 0 && (
        <div className="mb-4">
          <strong>Images</strong>
          <div className="flex gap-2 mt-2 flex-wrap">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`img-${i}`}
                className="w-36 h-24 object-cover border rounded"
              />
            ))}
          </div>
        </div>
      )}

      {currentReport.overall_comments && (
        <div className="mb-4">
          <strong>Comments</strong>
          <p>{currentReport.overall_comments}</p>
        </div>
      )}
    </div>
  );
};

export default PathologistReportView;
