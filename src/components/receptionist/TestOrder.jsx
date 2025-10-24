import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createTestOrder } from "../../store/slices/testOrderSlice";
import { fetchTests, fetchTestCategories } from "../../store/slices/testSlice";
import { fetchQuestionsByTest } from "../../store/slices/dynamicQuestionSlice";
import { createVisit } from "../../store/slices/visitSlice";

const TestOrder = ({ patient, onOrderComplete, onBack }) => {
  const dispatch = useDispatch();
  const {
    tests,
    testCategories,
    loading: testsLoading,
  } = useSelector((state) => state.tests);
  const { loading: orderLoading } = useSelector((state) => state.testOrders);
  const { questionsByTest, loading: questionsLoading } = useSelector(
    (state) => state.dynamicQuestions
  );
  const { user } = useSelector((state) => state.auth || {});

  const currentPatient = patient?.id ? patient : patient?.data ?? patient;

  const [selectedTests, setSelectedTests] = useState([]);
  const [dynamicAnswers, setDynamicAnswers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingQuestionsForTest, setLoadingQuestionsForTest] = useState(null);

  // Fetch tests on component mount
  useEffect(() => {
    dispatch(fetchTests());
    dispatch(fetchTestCategories());
  }, [dispatch]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const categoryChips = [
    { id: "all", name: "All Tests" },
    ...((testCategories || []).map((c) => ({ id: c.id, name: c.name })) || []),
  ];
  // Filter tests based on search and category
  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || test.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get questions for a specific test
  const getTestQuestions = (testId) => {
    return questionsByTest[testId] || [];
  };

  const handleTestToggle = async (test) => {
    if (selectedTests.find((t) => t.id === test.id)) {
      // Deselect test
      setSelectedTests(selectedTests.filter((t) => t.id !== test.id));
      // Remove dynamic answers for this test
      const newAnswers = { ...dynamicAnswers };
      delete newAnswers[test.id];
      setDynamicAnswers(newAnswers);
    } else {
      // Select test
      setSelectedTests([...selectedTests, test]);

      // Fetch dynamic questions for this test if not already loaded
      if (!questionsByTest[test.id]) {
        setLoadingQuestionsForTest(test.id);
        try {
          await dispatch(fetchQuestionsByTest(test.id)).unwrap();
        } catch (error) {
          console.error("Failed to fetch questions for test:", test.id, error);
          toast.error(`Failed to load questions for ${test.name}`);
        } finally {
          setLoadingQuestionsForTest(null);
        }
      }
    }
  };

  const handleDynamicAnswer = (testId, questionId, value) => {
    setDynamicAnswers((prev) => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        [questionId]: value,
      },
    }));
  };

  const calculateTotal = () => {
    return selectedTests.reduce((total, test) => total + (test.price || 0), 0);
  };

  const renderDynamicQuestion = (testId, question) => {
    const currentAnswer = dynamicAnswers[testId]?.[question.id];

    switch (question.field_type) {
      case "radio":
        return (
          <div key={question.id} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {question.question_text} {question.is_required && "*"}
            </label>
            <div className="flex flex-wrap gap-2">
              {question.options?.map((option) => (
                <label key={option} className="flex items-center text-xs">
                  <input
                    type="radio"
                    name={`${testId}-${question.id}`}
                    value={option}
                    checked={currentAnswer === option}
                    onChange={(e) =>
                      handleDynamicAnswer(testId, question.id, e.target.value)
                    }
                    className="mr-1 text-[#36F1A2] focus:ring-[#36F1A2]"
                    required={question.is_required}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div key={question.id} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {question.question_text} {question.is_required && "*"}
            </label>
            <div className="flex flex-wrap gap-2">
              {question.options?.map((option) => (
                <label key={option} className="flex items-center text-xs">
                  <input
                    type="checkbox"
                    checked={currentAnswer?.includes?.(option) || false}
                    onChange={(e) => {
                      const currentValues = currentAnswer || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v) => v !== option);
                      handleDynamicAnswer(testId, question.id, newValues);
                    }}
                    className="mr-1 text-[#36F1A2] focus:ring-[#36F1A2]"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        );

      case "text":
        return (
          <div key={question.id} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {question.question_text} {question.is_required && "*"}
            </label>
            <input
              type="text"
              value={currentAnswer || ""}
              onChange={(e) =>
                handleDynamicAnswer(testId, question.id, e.target.value)
              }
              placeholder={question.placeholder}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#36F1A2] focus:border-transparent"
            />
          </div>
        );

      case "dropdown":
        return (
          <div key={question.id} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {question.question_text} {question.is_required && "*"}
            </label>
            <select
              value={currentAnswer || ""}
              onChange={(e) =>
                handleDynamicAnswer(testId, question.id, e.target.value)
              }
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#36F1A2] focus:border-transparent"
              required={question.is_required}
            >
              <option value="">Select an option</option>
              {question.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        );

      default:
        return null;
    }
  };

  // Check if all required dynamic questions are answered for a test
  const isTestReadyForSubmission = (test) => {
    const testQuestions = getTestQuestions(test.id);
    if (!testQuestions || testQuestions.length === 0) {
      return true;
    }

    const testAnswers = dynamicAnswers[test.id] || {};

    return testQuestions.every((question) => {
      if (!question.is_required) return true;

      const answer = testAnswers[question.id];
      if (question.field_type === "checkbox") {
        return answer && answer.length > 0;
      }
      return answer && answer.toString().trim() !== "";
    });
  };

  // Check if all selected tests are ready for submission
  const areAllTestsReady = () => {
    return selectedTests.every((test) => isTestReadyForSubmission(test));
  };

  const handleSubmitOrder = async () => {
    if (selectedTests.length === 0) {
      toast.error("Please select at least one test");
      return;
    }
    if (!areAllTestsReady()) {
      toast.error("Please answer all required questions for selected tests");
      return;
    }

    try {
      // 1) Create a visit first (backend will give us visit.id)
      const now = new Date();
      const visitPayload = {
        patient_id: currentPatient.id,
        receptionist_id: user?.id || null,
        visit_date: now.toISOString().split("T")[0],
        visit_time: now.toTimeString().slice(0, 5), // HH:MM
        status: "registered",
        priority: "routine",
      };
      const visit = await dispatch(createVisit(visitPayload)).unwrap();

      // 2) Create test orders using visit_id
      const orderPromises = selectedTests.map((test) =>
        dispatch(
          createTestOrder({
            visit_id: visit.data.id,
            test_id: test.id,
            priority: "normal",
            sample_type: test.sample_type || "serum",
            dynamic_answers: dynamicAnswers[test.id] || {},
          })
        ).unwrap()
      );

      await Promise.all(orderPromises);

      toast.success("Visit and test orders created successfully!");
      if (onOrderComplete) onOrderComplete();
    } catch (error) {
      console.error("Failed to create visit/test orders:", error);
      toast.error(
        typeof error === "string"
          ? error
          : "Failed to create visit or test orders"
      );
    }
  };

  const isLoading = orderLoading || testsLoading;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#36F1A2] to-[#085DB6] text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Order Laboratory Tests</h1>
              <p className="text-blue-100">
                Step 2: Select tests for {patient.full_name} (
                {patient.card_number})
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">
                Patient: {patient.full_name}
              </div>
              <div className="text-sm opacity-90">
                Card: {patient.card_number}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600">
                1
              </div>
              <div className="ml-2 text-sm font-medium">Patient Info</div>
            </div>
            <div className="w-16 h-1 bg-gray-200 mx-4"></div>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#235F72] text-white">
                2
              </div>
              <div className="ml-2 text-sm font-medium">Order Tests</div>
            </div>
          </div>

          {/* Test Selection Panel */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[#235F72] border-b pb-2">
              Select Laboratory Tests
            </h3>

            {/* Search and Filter */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {categoryChips.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(
                        category.id === "all" ? "all" : Number(category.id)
                      )
                    }
                    className={`px-3 py-1 text-xs rounded-full transition duration-200 ${
                      selectedCategory === category.id ||
                      (category.id !== "all" &&
                        selectedCategory === Number(category.id))
                        ? "bg-[#235F72] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tests List */}
            <div className="max-h-96 overflow-y-auto space-y-3">
              {testsLoading ? (
                <div className="p-4 text-center text-gray-600">
                  Loading tests...
                </div>
              ) : filteredTests.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No tests found matching your criteria.
                </div>
              ) : (
                filteredTests.map((test) => {
                  const isSelected = selectedTests.find(
                    (t) => t.id === test.id
                  );
                  const testQuestions = getTestQuestions(test.id);
                  const hasDynamicQuestions =
                    testQuestions && testQuestions.length > 0;
                  const isReady = isTestReadyForSubmission(test);
                  const isLoadingQuestions =
                    loadingQuestionsForTest === test.id;

                  return (
                    <div
                      key={test.id}
                      className={`border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
                        isSelected
                          ? "border-[#36F1A2] bg-[#36F1A2] bg-opacity-5"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div
                            className={`flex-shrink-0 w-5 h-5 mt-1 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? "bg-[#36F1A2] border-[#36F1A2]"
                                : "bg-white border-gray-300"
                            }`}
                            onClick={() => handleTestToggle(test)}
                          >
                            {isSelected && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={3}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-semibold text-gray-900 text-sm">
                                    {test.name}
                                  </h4>
                                  {hasDynamicQuestions && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                      📝 Questions
                                    </span>
                                  )}
                                  {isSelected &&
                                    !isReady &&
                                    hasDynamicQuestions && (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                        ⚠️ Required
                                      </span>
                                    )}
                                  {isLoadingQuestions && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                      Loading...
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  {test.description}
                                </p>
                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                  <span>Sample: {test.sample_type}</span>
                                  <span>Time: {test.processing_time}</span>
                                  <span>Tube: {test.tube_type}</span>
                                </div>
                              </div>

                              <div className="text-right ml-4">
                                <div className="font-bold text-[#235F72] text-lg">
                                  ETB {test.price || 0}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {test.category_name}
                                </div>
                              </div>
                            </div>

                            {/* Dynamic Questions */}
                            {isSelected && hasDynamicQuestions && (
                              <div className="mt-3 p-3 bg-white border border-[#36F1A2] rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-[#235F72] text-xs">
                                    Additional Information Required:
                                  </h5>
                                  {!isReady && (
                                    <span className="text-xs text-red-600 font-medium">
                                      * Required fields missing
                                    </span>
                                  )}
                                </div>
                                <div className="space-y-3">
                                  {testQuestions.map((question) => (
                                    <div key={question.id}>
                                      {renderDynamicQuestion(test.id, question)}
                                      {question.is_required &&
                                        !dynamicAnswers[test.id]?.[
                                          question.id
                                        ] && (
                                          <p className="text-xs text-red-500 mt-1">
                                            This field is required
                                          </p>
                                        )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Loading state for questions */}
                            {isSelected && isLoadingQuestions && (
                              <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="text-center text-gray-600 text-sm">
                                  Loading questions...
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Selected Tests Summary */}
          {selectedTests.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-[#085DB6]">
                    Order Summary ({selectedTests.length} tests selected)
                  </h4>
                  {!areAllTestsReady() && (
                    <span className="text-sm text-red-600 font-medium">
                      ⚠️ Please complete all required questions
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  {selectedTests.map((test) => {
                    const testQuestions = getTestQuestions(test.id);
                    const isReady = isTestReadyForSubmission(test);
                    const hasQuestions =
                      testQuestions && testQuestions.length > 0;

                    return (
                      <div
                        key={test.id}
                        className="flex justify-between items-center py-2 border-b border-blue-100 last:border-b-0"
                      >
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">
                              {test.name}
                            </span>
                            {hasQuestions && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  isReady
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {isReady ? "✓ Ready" : "⚠️ Incomplete"}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600">
                            {test.description}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-[#235F72] font-semibold">
                            ETB {test.price || 0}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTestToggle(test);
                            }}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-blue-200">
                  <span className="font-bold text-lg">Total Amount:</span>
                  <span className="text-2xl font-bold text-[#235F72]">
                    ETB {calculateTotal()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between space-x-4 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-semibold"
            >
              ← Back to Patient Info
            </button>
            <div className="flex space-x-4">
              <button
                type="button"
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitOrder}
                disabled={
                  isLoading || selectedTests.length === 0 || !areAllTestsReady()
                }
                className="px-8 py-3 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Orders..." : "Create Test Orders"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestOrder;
