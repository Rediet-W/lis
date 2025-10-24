import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTestResult,
  updateTestResult,
} from "../../store/slices/testResultSlice";
import {
  createParameterResult,
  updateParameterResult,
} from "../../store/slices/parameterResultSlice";
import { fetchTestOrderResults } from "../../store/slices/testOrderSlice";
import { toast } from "react-toastify";

const ResultEntryForm = ({
  order,
  onClose,
  testParameters = [],
  testDetails,
  dynamicQuestionsInfo,
  findReferenceRange,
}) => {
  const dispatch = useDispatch();
  const { testOrderResults, loading: orderResultsLoading } = useSelector(
    (s) => s.testOrders || { testOrderResults: [], loading: false }
  );
  const { loading: resultCrudLoading } = useSelector(
    (s) => s.testResults || { loading: false }
  );
  const { loading: parameterResultLoading } = useSelector(
    (s) => s.parameterResults || { loading: false }
  );
  const { user } = useSelector((state) => state.auth || {});

  const loading =
    orderResultsLoading || resultCrudLoading || parameterResultLoading;

  const [mainResult, setMainResult] = useState({
    result_value: "",
    numeric_value: "",
    unit: "",
    status: "normal",
    comments: "",
    interpretation: "",
    is_verified: false,
  });

  const [parameterResults, setParameterResults] = useState({});
  const [currentSection, setCurrentSection] = useState("main");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing results
  useEffect(() => {
    if (order?.id) {
      dispatch(fetchTestOrderResults(order.id));
    }
  }, [dispatch, order?.id]);

  // Process existing results when loaded
  useEffect(() => {
    const list = Array.isArray(testOrderResults)
      ? testOrderResults
      : testOrderResults?.data || [];

    console.log("Existing test order results:", list);

    // Find main test result
    const mainResultData = list.find(
      (r) => r.test_order_id === order?.id && !r.test_parameter_id
    );
    if (mainResultData) {
      setMainResult({
        result_value: mainResultData.result_value || "",
        numeric_value: mainResultData.numeric_value || "",
        unit: mainResultData.unit || "",
        status: mainResultData.status || "normal",
        comments: mainResultData.comments || "",
        interpretation: mainResultData.interpretation || "",
        is_verified: mainResultData.is_verified || false,
      });
    }

    // Find parameter results
    const paramResults = {};
    list
      .filter((r) => r.test_parameter_id)
      .forEach((paramResult) => {
        paramResults[paramResult.test_parameter_id] = {
          id: paramResult.id,
          value:
            paramResult.result_value?.toString() ||
            paramResult.numeric_value?.toString() ||
            paramResult.string_value ||
            "",
          numeric_value: paramResult.numeric_value || "",
          unit: paramResult.unit || "",
          status: paramResult.status || "normal",
          comments: paramResult.comments || "",
        };
      });
    setParameterResults(paramResults);
  }, [testOrderResults, order?.id]);

  // Initialize parameter results for all test parameters
  useEffect(() => {
    if (testParameters.length > 0) {
      const initialResults = {};
      testParameters.forEach((param) => {
        if (!parameterResults[param.id]) {
          initialResults[param.id] = {
            value: "",
            numeric_value: "",
            unit: param.unit || "",
            status: "unknown",
            comments: "",
          };
        }
      });
      if (Object.keys(initialResults).length > 0) {
        setParameterResults((prev) => ({ ...prev, ...initialResults }));
      }
    }
  }, [testParameters]);

  // Reset form function
  const resetForm = () => {
    setMainResult({
      result_value: "",
      numeric_value: "",
      unit: "",
      status: "normal",
      comments: "",
      interpretation: "",
      is_verified: false,
    });
    setParameterResults({});
    setCurrentSection(0);
  };

  // Add null check for order
  if (!order) {
    return (
      <div className="p-6 text-center text-red-600">
        Error: No order selected
      </div>
    );
  }

  // Calculate status based on reference range and value
  const calculateParameterStatus = (parameter, value) => {
    if (!value || value === "" || value === null) return "unknown";

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "unknown";

    const referenceRange = parameter.applicable_reference_range;
    if (!referenceRange) return "unknown";

    const { min_value, max_value, critical_low, critical_high } =
      referenceRange;

    if (critical_low !== null && numValue <= critical_low) return "critical";
    if (critical_high !== null && numValue >= critical_high) return "critical";
    if (min_value !== null && numValue < min_value) return "low";
    if (max_value !== null && numValue > max_value) return "high";

    return "normal";
  };

  // Auto-calculate status when value changes - FIXED INPUT HANDLING
  const updateParameterResultValue = (parameterId, field, value) => {
    const parameter = testParameters.find((p) => p.id === parameterId);

    setParameterResults((prev) => ({
      ...prev,
      [parameterId]: {
        ...prev[parameterId],
        [field]: value,
        // Only update status and unit if it's the value field and value is not empty
        ...(field === "value" && {
          status: value
            ? calculateParameterStatus(parameter, value)
            : "unknown",
          unit:
            parameter?.applicable_reference_range?.unit ||
            parameter?.unit ||
            "",
        }),
      },
    }));
  };

  // Get status style with colors and icons
  const getStatusStyle = (status) => {
    const styles = {
      normal: {
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        icon: "✅",
        label: "Normal",
      },
      low: {
        color: "text-orange-600",
        bg: "bg-orange-50",
        border: "border-orange-200",
        icon: "📉",
        label: "Low",
      },
      high: {
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        icon: "📈",
        label: "High",
      },
      critical: {
        color: "text-red-700",
        bg: "bg-red-100",
        border: "border-red-300",
        icon: "🚨",
        label: "Critical",
      },
      unknown: {
        color: "text-gray-600",
        bg: "bg-gray-50",
        border: "border-gray-200",
        icon: "❓",
        label: "Unknown",
      },
    };
    return styles[status] || styles.unknown;
  };

  // Format reference range for display
  const formatReferenceRange = (parameter) => {
    const range = parameter.applicable_reference_range;
    if (!range) return "No reference range available";

    const { min_value, max_value, unit, critical_low, critical_high } = range;

    let rangeText = "";
    if (min_value !== null && max_value !== null) {
      rangeText = `${min_value} - ${max_value} ${unit || ""}`;
    } else if (min_value !== null) {
      rangeText = `> ${min_value} ${unit || ""}`;
    } else if (max_value !== null) {
      rangeText = `< ${max_value} ${unit || ""}`;
    } else {
      return "No reference values";
    }

    if (critical_low !== null || critical_high !== null) {
      rangeText += ` (Critical: `;
      if (critical_low !== null) rangeText += `<${critical_low}`;
      if (critical_low !== null && critical_high !== null) rangeText += " or ";
      if (critical_high !== null) rangeText += `>${critical_high}`;
      rangeText += `)`;
    }

    return rangeText;
  };

  // Save results to both test_results and parameter_results - FIXED DATA SUBMISSION
  const saveResults = async (isFinal = false) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      console.log("Saving results...", {
        mainResult,
        parameterResults,
        isFinal,
      });

      let mainResultId = null;

      // 1. First, check if we need to create/update main test result
      const shouldSaveMainResult =
        testParameters.length === 0 ||
        mainResult.result_value ||
        mainResult.numeric_value ||
        mainResult.comments ||
        mainResult.interpretation;

      if (shouldSaveMainResult) {
        // FIXED: Proper data structure for main test result
        const mainResultData = {
          test_order_id: order.id,
          result_value: mainResult.result_value || null,
          numeric_value:
            mainResult.numeric_value && mainResult.numeric_value.trim() !== ""
              ? parseFloat(mainResult.numeric_value)
              : null,
          unit: mainResult.unit || null,
          status: mainResult.status,
          comments: mainResult.comments || null,
          interpretation: mainResult.interpretation || null,
          is_verified: isFinal,
          laboratorist_id: user.id,
        };

        // Clean up empty values
        Object.keys(mainResultData).forEach((key) => {
          if (mainResultData[key] === "" || mainResultData[key] === undefined) {
            mainResultData[key] = null;
          }
        });

        const existingMain = Array.isArray(testOrderResults)
          ? testOrderResults.find(
              (r) => r.test_order_id === order.id && !r.test_parameter_id
            )
          : null;

        if (existingMain?.id) {
          const result = await dispatch(
            updateTestResult({
              id: existingMain.id,
              data: mainResultData,
            })
          ).unwrap();
          mainResultId = existingMain.id;
          console.log("Updated main test result:", result);
        } else {
          const result = await dispatch(
            createTestResult(mainResultData)
          ).unwrap();
          mainResultId = result.id;
          console.log("Created main test result:", result);
        }
      }

      // 2. Save parameter results (for tests with parameters)
      if (testParameters.length > 0) {
        // If we have parameters but no main result was created, we need to create one
        if (!mainResultId) {
          const mainResultData = {
            test_order_id: order.id,
            result_value: null,
            unit: null,
            status: "normal",
            comments: mainResult.comments || null,
            interpretation: mainResult.interpretation || null,
            is_verified: isFinal,
            laboratorist_id: user.id,
          };

          const existingMain = Array.isArray(testOrderResults)
            ? testOrderResults.find(
                (r) => r.test_order_id === order.id && !r.test_parameter_id
              )
            : null;

          if (existingMain?.id) {
            const result = await dispatch(
              updateTestResult({
                id: existingMain.id,
                data: mainResultData,
              })
            ).unwrap();
            mainResultId = existingMain.id;
          } else {
            const result = await dispatch(
              createTestResult(mainResultData)
            ).unwrap();
            mainResultId = result.id;
          }
          console.log("Created main result for parameters:", mainResultId);
        }

        // Now save all parameter results
        for (const [paramId, paramResult] of Object.entries(parameterResults)) {
          // Only save if value is not empty
          if (paramResult.value && paramResult.value.trim() !== "") {
            const parameter = testParameters.find(
              (p) => p.id === parseInt(paramId)
            );
            const referenceRange = parameter?.applicable_reference_range;

            // Convert to numeric if possible, otherwise keep as string
            const numericValue = parseFloat(paramResult.value);
            const isNumeric = !isNaN(numericValue);

            // FIXED: Proper parameter result data structure
            const paramResultData = {
              test_result_id: mainResultId,
              test_parameter_id: parseInt(paramId), // Changed from parameter_id to test_parameter_id
              result_value: isNumeric ? numericValue : paramResult.value,
              numeric_value: isNumeric ? numericValue : null,
              unit: paramResult.unit || null,
              status: paramResult.status,
              comments: paramResult.comments || null,
            };

            // Clean up empty values
            Object.keys(paramResultData).forEach((key) => {
              if (
                paramResultData[key] === "" ||
                paramResultData[key] === undefined
              ) {
                paramResultData[key] = null;
              }
            });

            const existingParam = Array.isArray(testOrderResults)
              ? testOrderResults.find(
                  (r) =>
                    r.test_parameter_id === parseInt(paramId) &&
                    r.test_result_id === mainResultId
                )
              : null;

            if (existingParam?.id) {
              await dispatch(
                updateParameterResult({
                  id: existingParam.id,
                  data: paramResultData,
                })
              ).unwrap();
            } else {
              await dispatch(createParameterResult(paramResultData)).unwrap();
            }
          }
        }
        console.log("All parameter results saved");
      }

      console.log("Results saved successfully");

      // Show success toast
      toast.success(
        isFinal
          ? "Results verified and finalized successfully!"
          : "Results saved as draft successfully!",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      // Auto-close modal and reset form
      setTimeout(() => {
        resetForm();
        onClose?.();
      }, 1500);
    } catch (error) {
      console.error("Failed to save results:", error);

      let errorMessage = "Failed to save results. Please try again.";

      if (
        error.message?.includes("already exists") ||
        error.includes("already exists")
      ) {
        errorMessage =
          "Results for this order already exist. Please update the existing results instead.";
      } else if (
        error.message?.includes("Failed to update") ||
        error.includes("Failed to update")
      ) {
        errorMessage =
          "Failed to update results. The results may have been verified and cannot be modified.";
      } else if (error.message) {
        // Show the actual server error message if available
        errorMessage = `Failed to save results: ${error.message}`;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    saveResults(false);
  };

  const handleFinalize = (e) => {
    e.preventDefault();
    saveResults(true);
  };

  // Check if we have any parameter results to save
  const hasParameterResults =
    testParameters.length > 0 &&
    Object.values(parameterResults).some(
      (result) => result.value && result.value.trim() !== ""
    );

  // Check if we have any main result data to save
  const hasMainResultData =
    mainResult.result_value?.trim() ||
    mainResult.numeric_value?.trim() ||
    mainResult.comments?.trim() ||
    mainResult.interpretation?.trim();

  const canSave = hasParameterResults || hasMainResultData;
  const isSaveDisabled = loading || isSubmitting || !canSave;

  // Enhanced dynamic questions display with question-answer pairing
  const renderDynamicQuestions = () => {
    if (
      !order.dynamic_answers ||
      Object.keys(order.dynamic_answers).length === 0
    ) {
      return null;
    }

    // Get questions from dynamic_questions_info or use default
    const questionsInfo = order.dynamic_questions_info || {};

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-[#085DB6] mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Patient-Specific Information
        </h4>
        <div className="space-y-3">
          {Object.entries(order.dynamic_answers).map(([key, value]) => {
            // Get the question text from questions info or format the key
            const questionText =
              questionsInfo[key] ||
              key
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            return (
              <div key={key} className="bg-white p-3 rounded border">
                <div className="font-medium text-gray-700 mb-1">
                  {questionText}
                </div>
                <div className="text-gray-600">
                  <span className="font-semibold">
                    {value || "Not specified"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render parameter with reference ranges and auto-calculation - FIXED INPUT HANDLING
  const renderParameterResults = () => {
    if (testParameters.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No parameters defined for this test.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#235F72] mb-4">
          Test Parameters
        </h3>

        {testParameters.map((param) => {
          const result = parameterResults[param.id] || {};
          const statusStyle = getStatusStyle(result.status);
          const referenceRangeText = formatReferenceRange(param);

          return (
            <div
              key={param.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                {/* Parameter Info */}
                <div className="md:col-span-4">
                  <label className="block font-medium text-gray-700 text-sm">
                    {param.name}
                  </label>
                  <div className="text-xs text-gray-500 mt-1">
                    <div className="font-medium">
                      Reference: {referenceRangeText}
                    </div>
                    {param.description && (
                      <div className="mt-1 italic">{param.description}</div>
                    )}
                  </div>
                </div>

                {/* Value Input - FIXED: Proper input handling */}
                <div className="md:col-span-3">
                  <input
                    type="text"
                    value={result.value || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      // Allow empty string, numbers, and decimal points
                      if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
                        updateParameterResultValue(param.id, "value", newValue);
                      }
                    }}
                    onBlur={(e) => {
                      // Trim and validate on blur
                      const trimmedValue = e.target.value.trim();
                      if (trimmedValue !== e.target.value) {
                        updateParameterResultValue(
                          param.id,
                          "value",
                          trimmedValue
                        );
                      }
                    }}
                    placeholder="Enter value"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent text-sm"
                  />
                </div>

                {/* Unit */}
                <div className="md:col-span-2">
                  <span className="text-gray-600 text-sm">
                    {result.unit || param.unit || "N/A"}
                  </span>
                </div>

                {/* Auto-calculated Status */}
                <div className="md:col-span-3">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}
                  >
                    <span className="mr-1">{statusStyle.icon}</span>
                    {statusStyle.label}
                  </div>
                </div>
              </div>

              {/* Parameter-specific comments */}
              <div className="mt-3">
                <textarea
                  rows={2}
                  value={result.comments || ""}
                  onChange={(e) =>
                    updateParameterResultValue(
                      param.id,
                      "comments",
                      e.target.value
                    )
                  }
                  placeholder="Parameter-specific comments or observations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Simple result entry for tests without parameters - FIXED INPUT HANDLING
  const renderSimpleResultEntry = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#235F72]">Test Result</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Result Value
          </label>
          <input
            value={mainResult.result_value}
            onChange={(e) =>
              setMainResult((prev) => ({
                ...prev,
                result_value: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
            placeholder="Enter result value"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numeric Value
          </label>
          <input
            type="text"
            value={mainResult.numeric_value}
            onChange={(e) => {
              const newValue = e.target.value;
              // Allow empty string, numbers, and decimal points
              if (newValue === "" || /^-?\d*\.?\d*$/.test(newValue)) {
                setMainResult((prev) => ({
                  ...prev,
                  numeric_value: newValue,
                }));
              }
            }}
            onBlur={(e) => {
              const trimmedValue = e.target.value.trim();
              if (trimmedValue !== e.target.value) {
                setMainResult((prev) => ({
                  ...prev,
                  numeric_value: trimmedValue,
                }));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
            placeholder="Enter numeric value"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit
          </label>
          <input
            value={mainResult.unit}
            onChange={(e) =>
              setMainResult((prev) => ({ ...prev, unit: e.target.value }))
            }
            onBlur={(e) => {
              const trimmedValue = e.target.value.trim();
              if (trimmedValue !== e.target.value) {
                setMainResult((prev) => ({
                  ...prev,
                  unit: trimmedValue,
                }));
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
            placeholder="Enter unit"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={mainResult.status}
            onChange={(e) =>
              setMainResult((prev) => ({ ...prev, status: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
          >
            <option value="normal">Normal</option>
            <option value="low">Low</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Render comments section
  const renderCommentsSection = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Technical Comments
        </label>
        <textarea
          rows={4}
          value={mainResult.comments}
          onChange={(e) =>
            setMainResult((prev) => ({ ...prev, comments: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
          placeholder="Enter any technical observations, sample quality notes, or procedural comments..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Clinical Interpretation
        </label>
        <textarea
          rows={4}
          value={mainResult.interpretation}
          onChange={(e) =>
            setMainResult((prev) => ({
              ...prev,
              interpretation: e.target.value,
            }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
          placeholder="Enter clinical interpretation and summary of findings..."
        />
      </div>
    </div>
  );

  return (
    <form onSubmit={(e) => e.preventDefault()} className="p-6 space-y-6">
      {/* Patient Information */}
      <div className="bg-gray-50 rounded-lg p-4 border">
        <h3 className="font-semibold text-[#235F72] mb-3">
          Patient Information
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Name:</span>{" "}
            {order?.patient_name || order?.full_name || "N/A"}
          </div>
          <div>
            <span className="font-medium">Card No:</span>{" "}
            {order?.card_number || "N/A"}
          </div>
          <div>
            <span className="font-medium">Age/Gender:</span>{" "}
            {order?.age || "N/A"} / {order?.gender || "N/A"}
          </div>
          <div>
            <span className="font-medium">Sample Type:</span>{" "}
            {order?.sample_type || "N/A"}
          </div>
        </div>
      </div>

      {/* Enhanced Dynamic Questions Display with proper pairing */}
      {renderDynamicQuestions()}

      {/* Test Parameters Section */}
      <div className="flex gap-2 border-b pb-4">
        <button
          type="button"
          onClick={() => setCurrentSection("main")}
          className={`px-4 py-2 rounded-lg ${
            currentSection === "main"
              ? "bg-[#235F72] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Main Result
        </button>
        {testParameters.length > 0 && (
          <button
            type="button"
            onClick={() => setCurrentSection("parameters")}
            className={`px-4 py-2 rounded-lg ${
              currentSection === "parameters"
                ? "bg-[#235F72] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Test Parameters ({testParameters.length})
          </button>
        )}
        <button
          type="button"
          onClick={() => setCurrentSection("comments")}
          className={`px-4 py-2 rounded-lg ${
            currentSection === "comments"
              ? "bg-[#235F72] text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Comments & Interpretation
        </button>
      </div>

      {/* Results Section */}
      {currentSection === "main" && renderSimpleResultEntry()}
      {currentSection === "parameters" && renderParameterResults()}

      {/* Comments Section */}
      {currentSection === "comments" && renderCommentsSection()}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSaveDisabled}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Draft"}
        </button>
        <button
          type="button"
          onClick={handleFinalize}
          disabled={isSaveDisabled}
          className="flex-1 bg-[#36F1A2] text-[#235F72] py-3 rounded-lg font-semibold hover:bg-[#2dd191] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : "Verify & Finalize Results"}
        </button>
        <button
          type="button"
          onClick={() => {
            resetForm();
            onClose?.();
          }}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>

      {/* Save validation message */}
      {!canSave && (
        <div className="text-center text-sm text-orange-600">
          Please enter at least one test result value or comment to save.
        </div>
      )}
    </form>
  );
};

export default ResultEntryForm;
