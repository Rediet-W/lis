import React from "react";
import PrintDetailedReport from "./printResults";

const PrintReportPage = () => {
  // Get order ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const testOrderId = urlParams.get("orderId");

  return (
    <div className="print-container">
      <PrintDetailedReport testOrderId={testOrderId} />
    </div>
  );
};

export default PrintReportPage;
