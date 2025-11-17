import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchTests,
  fetchTestCategories,
  createTest,
  updateTest,
  deleteTest,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError,
  fetchSampleTypes,
  createSampleType,
  updateSampleType,
  deleteSampleType,
} from "../../store/slices/testSlice";
import {
  fetchParametersByTest,
  createTestParameter,
  updateTestParameter,
  deleteTestParameter,
  clearParametersByTest,
} from "../../store/slices/testParameterSlice";
import {
  fetchQuestionsByTest,
  createDynamicQuestion,
  updateDynamicQuestion,
  deleteDynamicQuestion,
  clearQuestionsByTest,
} from "../../store/slices/dynamicQuestionSlice";
import {
  fetchRangesByParameter,
  createReferenceRange,
  updateReferenceRange,
  deleteReferenceRange,
  clearRangesByParameter,
} from "../../store/slices/referenceRangeSlice";

const TestManagement = () => {
  const dispatch = useDispatch();
  const { tests, testCategories, loading, error } = useSelector(
    (state) => state.tests
  );
  const { parametersByTest, loading: parametersLoading } = useSelector(
    (state) => state.testParameters
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Category management states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCategoryDeleteConfirm, setShowCategoryDeleteConfirm] =
    useState(null);

  // Parameter management states
  const [showParameterModal, setShowParameterModal] = useState(null);
  const [editingParameter, setEditingParameter] = useState(null);
  const [showParameterDeleteConfirm, setShowParameterDeleteConfirm] =
    useState(null);
  const [newParameter, setNewParameter] = useState({
    parameter_name: "",
    unit: "",
  });
  const [showSampleTypeModal, setShowSampleTypeModal] = useState(false);
  const [editingSampleType, setEditingSampleType] = useState(null);
  const [showSampleTypeDeleteConfirm, setShowSampleTypeDeleteConfirm] =
    useState(null);
  const [newSampleType, setNewSampleType] = useState({
    name: "",
    description: "",
    is_active: 1,
  });

  // grab sample types from store
  const sampleTypes = useSelector((state) => state.tests.sampleTypes) || [];
  console.log("Sample Types:", sampleTypes);

  const [newTest, setNewTest] = useState({
    category_id: "",
    name: "",
    description: "",
    sample_type_id: "",
    sample_volume: "",
    tube_type: "EDTA",
    processing_time: "",
    linear_range: "",
    testing_modes: "standard",
    price: "",
    is_active: 1,
  });

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
  });

  const tubeTypes = [
    "EDTA",
    "Heparin",
    "Sodium Citrate",
    "Serum Separator",
    "Other",
  ];
  const testingModes = ["standard", "quick", "both"];

  useEffect(() => {
    dispatch(fetchTests());
    dispatch(fetchTestCategories());
    dispatch(fetchSampleTypes());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const filteredTests = tests.filter(
    (test) =>
      test.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Test CRUD functions (same as before)
  const handleAddTest = async () => {
    if (!newTest.name || !newTest.category_id || !newTest.sample_type) {
      toast.error(
        "Please fill in required fields: Name, Category, and Sample Type"
      );
      return;
    }

    const payload = {
      category_id: parseInt(newTest.category_id),
      name: newTest.name.trim(),
      description: newTest.description?.trim() || "",
      sample_type_id: newTest.sample_type_id,
      sample_volume: newTest.sample_volume?.trim() || "",
      tube_type: newTest.tube_type,
      processing_time: newTest.processing_time?.trim() || "",
      linear_range: newTest.linear_range?.trim() || "",
      testing_modes: newTest.testing_modes,
      price: newTest.price ? parseInt(newTest.price) : 0,
      is_active: 1,
    };

    try {
      await dispatch(createTest(payload)).unwrap();
      setShowAddModal(false);
      setNewTest({
        category_id: "",
        name: "",
        description: "",
        sample_type_id: "",
        sample_volume: "",
        tube_type: "EDTA",
        processing_time: "",
        linear_range: "",
        testing_modes: "standard",
        price: "",
        is_active: 1,
      });
    } catch (error) {
      console.error("Failed to create test:", error);
    }
  };

  const handleEditTest = (test) => {
    setEditingTest({
      ...test,
      category_id: test.category_id?.toString() || "",
    });
  };

  const handleUpdateTest = async () => {
    if (
      !editingTest.name ||
      !editingTest.category_id ||
      !editingTest.sample_type
    ) {
      toast.error("Please fill in required fields");
      return;
    }

    const payload = {
      category_id: parseInt(editingTest.category_id),
      name: editingTest.name.trim(),
      description: editingTest.description?.trim() || "",
      sample_type_id: editingTest.sample_type_id,
      sample_volume: editingTest.sample_volume?.trim() || "",
      tube_type: editingTest.tube_type,
      processing_time: editingTest.processing_time?.trim() || "",
      linear_range: editingTest.linear_range?.trim() || "",
      testing_modes: editingTest.testing_modes,
      price: editingTest.price ? parseInt(editingTest.price) : 0,
      is_active: editingTest.is_active ? 1 : 0,
    };

    try {
      await dispatch(
        updateTest({ id: editingTest.id, data: payload })
      ).unwrap();
      setEditingTest(null);
    } catch (error) {
      console.error("Failed to update test:", error);
    }
  };

  const handleDeleteTest = async (testId) => {
    try {
      await dispatch(deleteTest(testId)).unwrap();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete test:", error);
    }
  };

  // Category Management Functions (same as before)
  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast.error("Please enter category name");
      return;
    }

    const payload = {
      name: newCategory.name.trim(),
      description: newCategory.description?.trim() || "",
    };

    try {
      await dispatch(createCategory(payload)).unwrap();
      setShowCategoryModal(false);
      setNewCategory({
        name: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory({ ...category });
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory.name) {
      toast.error("Please enter category name");
      return;
    }

    const payload = {
      name: editingCategory.name.trim(),
      description: editingCategory.description?.trim() || "",
    };

    try {
      await dispatch(
        updateCategory({ id: editingCategory.id, data: payload })
      ).unwrap();
      setEditingCategory(null);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await dispatch(deleteCategory(categoryId)).unwrap();
      setShowCategoryDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  // Parameter Management Functions
  const handleShowParameters = async (testId) => {
    setShowParameterModal(testId);
    // Load parameters for this test if not already loaded
    if (!parametersByTest[testId]) {
      await dispatch(fetchParametersByTest(testId));
    }
  };

  const handleAddParameter = async (testId) => {
    if (!newParameter.parameter_name) {
      toast.error("Please enter parameter name");
      return;
    }

    const payload = {
      test_id: testId,
      parameter_name: newParameter.parameter_name.trim(),
      unit: newParameter.unit?.trim() || "",
    };

    try {
      await dispatch(createTestParameter(payload)).unwrap();
      setNewParameter({
        parameter_name: "",
        unit: "",
      });
    } catch (error) {
      console.error("Failed to create parameter:", error);
    }
  };

  const handleEditParameter = (parameter) => {
    setEditingParameter({ ...parameter });
  };

  const handleUpdateParameter = async () => {
    if (!editingParameter.parameter_name) {
      toast.error("Please enter parameter name");
      return;
    }

    const payload = {
      parameter_name: editingParameter.parameter_name.trim(),
      unit: editingParameter.unit?.trim() || "",
    };

    try {
      await dispatch(
        updateTestParameter({ id: editingParameter.id, data: payload })
      ).unwrap();
      setEditingParameter(null);
    } catch (error) {
      console.error("Failed to update parameter:", error);
    }
  };

  const handleDeleteParameter = async (parameterId) => {
    try {
      await dispatch(deleteTestParameter(parameterId)).unwrap();
      setShowParameterDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete parameter:", error);
    }
  };

  const handleCloseParameterModal = (testId) => {
    setShowParameterModal(null);
    setNewParameter({
      parameter_name: "",
      unit: "",
    });
    dispatch(clearParametersByTest(testId));
  };

  const formatPrice = (price) => {
    return price ? `ETB ${price}` : "Not set";
  };

  const getTestParameters = (testId) => {
    return parametersByTest[testId] || [];
  };

  // Dynamic Questions states
  const [showQuestionModal, setShowQuestionModal] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [showQuestionDeleteConfirm, setShowQuestionDeleteConfirm] =
    useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question_text: "",
    field_type: "text",
    options: [],
    is_required: false,
  });

  // Reference Range states
  const [showRangeModal, setShowRangeModal] = useState(null);
  const [editingRange, setEditingRange] = useState(null);
  const [showRangeDeleteConfirm, setShowRangeDeleteConfirm] = useState(null);
  const [newRange, setNewRange] = useState({
    sample_type: "serum",
    gender: "both",
    min_age: "",
    max_age: "",
    unit: "",
    min_value: "",
    max_value: "",
    critical_low: "",
    critical_high: "",
    conditions: "",
  });
  // Enum options
  const fieldTypes = ["checkbox", "radio", "dropdown", "text"];
  const genders = ["male", "female", "both"];
  const { questionsByTest, loading: questionsLoading } = useSelector(
    (state) => state.dynamicQuestions
  );
  const { rangesByParameter, loading: rangesLoading } = useSelector(
    (state) => state.referenceRanges
  );

  const getTestQuestions = (testId) => {
    return questionsByTest[testId] || [];
  };

  const getParameterRanges = (parameterId) => {
    return rangesByParameter[parameterId] || [];
  };
  const handleShowQuestions = async (testId) => {
    setShowQuestionModal(testId);
    if (!questionsByTest[testId]) {
      await dispatch(fetchQuestionsByTest(testId));
    }
  };

  const handleAddQuestion = async (testId) => {
    if (!newQuestion.question_text) {
      toast.error("Please enter question text");
      return;
    }

    const payload = {
      test_id: testId,
      question_text: newQuestion.question_text.trim(),
      field_type: newQuestion.field_type,
      options: newQuestion.field_type !== "text" ? newQuestion.options : [],
      is_required: newQuestion.is_required ? 1 : 0,
    };

    try {
      await dispatch(createDynamicQuestion(payload)).unwrap();
      setNewQuestion({
        question_text: "",
        field_type: "text",
        options: [],
        is_required: false,
      });
    } catch (error) {
      console.error("Failed to create question:", error);
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion({ ...question });
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion.question_text) {
      toast.error("Please enter question text");
      return;
    }

    const payload = {
      question_text: editingQuestion.question_text.trim(),
      field_type: editingQuestion.field_type,
      options:
        editingQuestion.field_type !== "text" ? editingQuestion.options : [],
      is_required: editingQuestion.is_required ? 1 : 0,
    };

    try {
      await dispatch(
        updateDynamicQuestion({ id: editingQuestion.id, data: payload })
      ).unwrap();
      setEditingQuestion(null);
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await dispatch(deleteDynamicQuestion(questionId)).unwrap();
      setShowQuestionDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete question:", error);
    }
  };
  const handleCloseQuestionModal = (testId) => {
    setShowQuestionModal(null);
    setNewQuestion({
      question_text: "",
      field_type: "text",
      options: [],
      is_required: false,
    });
    dispatch(clearQuestionsByTest(testId));
  };

  const handleShowRanges = async (parameterId) => {
    setShowRangeModal(parameterId);
    if (!rangesByParameter[parameterId]) {
      await dispatch(fetchRangesByParameter(parameterId));
    }
  };

  const handleAddRange = async (parameterId) => {
    if (!newRange.min_value || !newRange.max_value) {
      toast.error("Please enter min and max values");
      return;
    }

    const payload = {
      parameter_id: parameterId,
      sample_type: newRange.sample_type,
      gender: newRange.gender,
      min_age: newRange.min_age ? parseInt(newRange.min_age) : null,
      max_age: newRange.max_age ? parseInt(newRange.max_age) : null,
      unit: newRange.unit?.trim() || "",
      min_value: parseFloat(newRange.min_value),
      max_value: parseFloat(newRange.max_value),
      critical_low: newRange.critical_low
        ? parseFloat(newRange.critical_low)
        : null,
      critical_high: newRange.critical_high
        ? parseFloat(newRange.critical_high)
        : null,
      conditions: newRange.conditions?.trim() || "",
    };

    try {
      await dispatch(createReferenceRange(payload)).unwrap();
      setNewRange({
        sample_type: "serum",
        gender: "both",
        min_age: "",
        max_age: "",
        unit: "",
        min_value: "",
        max_value: "",
        critical_low: "",
        critical_high: "",
        conditions: "",
      });
    } catch (error) {
      console.error("Failed to create reference range:", error);
    }
  };

  const handleEditRange = (range) => {
    setEditingRange({ ...range });
  };

  const handleUpdateRange = async () => {
    if (!editingRange.min_value || !editingRange.max_value) {
      toast.error("Please enter min and max values");
      return;
    }

    const payload = {
      sample_type: editingRange.sample_type,
      gender: editingRange.gender,
      min_age: editingRange.min_age ? parseInt(editingRange.min_age) : null,
      max_age: editingRange.max_age ? parseInt(editingRange.max_age) : null,
      unit: editingRange.unit?.trim() || "",
      min_value: parseFloat(editingRange.min_value),
      max_value: parseFloat(editingRange.max_value),
      critical_low: editingRange.critical_low
        ? parseFloat(editingRange.critical_low)
        : null,
      critical_high: editingRange.critical_high
        ? parseFloat(editingRange.critical_high)
        : null,
      conditions: editingRange.conditions?.trim() || "",
    };

    try {
      await dispatch(
        updateReferenceRange({ id: editingRange.id, data: payload })
      ).unwrap();
      setEditingRange(null);
    } catch (error) {
      console.error("Failed to update reference range:", error);
    }
  };

  const handleDeleteRange = async (rangeId) => {
    try {
      await dispatch(deleteReferenceRange(rangeId)).unwrap();
      setShowRangeDeleteConfirm(null);
    } catch (error) {
      console.error("Failed to delete reference range:", error);
    }
  };
  const handleCloseRangeModal = (parameterId) => {
    setShowRangeModal(null);
    setNewRange({
      sample_type: "serum",
      gender: "both",
      min_age: "",
      max_age: "",
      unit: "",
      min_value: "",
      max_value: "",
      critical_low: "",
      critical_high: "",
      conditions: "",
    });
    dispatch(clearRangesByParameter(parameterId));
  };
  const openAddSampleTypeModal = () => {
    setEditingSampleType(null);
    setNewSampleType({
      name: "",
      description: "",
      is_active: 1,
    });
    setShowSampleTypeModal(true);
  };

  const handleEditSampleType = (st) => {
    setEditingSampleType(st);
    setNewSampleType({
      name: st.name || "",
      description: st.description || "",
      is_active: st.is_active ?? 1,
    });
    setShowSampleTypeModal(true);
  };

  const handleSaveSampleType = async () => {
    try {
      if (editingSampleType) {
        await dispatch(
          updateSampleType({ id: editingSampleType.id, data: newSampleType })
        ).unwrap();
      } else {
        await dispatch(createSampleType(newSampleType)).unwrap();
      }
      setShowSampleTypeModal(false);
      setEditingSampleType(null);
      setNewSampleType({ name: "", description: "", is_active: 1 });
    } catch (err) {
      // errors are handled by thunks/toast; keep UI stable
      console.error(err);
    }
  };

  const handleDeleteSampleType = async (id) => {
    try {
      await dispatch(deleteSampleType(id)).unwrap();
      setShowSampleTypeDeleteConfirm(null);
    } catch (err) {
      console.error(err);
    }
  };
  if (loading && tests.length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading tests...</div>
        </div>
      </div>
    );
  }

  console.log("filtered tests", filteredTests);
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-end items-center">
          {/* <div>
            <h1 className="text-2xl font-bold text-[#235F72]">
              Test Management
            </h1>
            <p className="text-gray-600">
              Manage laboratory tests, categories, and parameters
            </p>
          </div> */}
          <div className="flex space-x-3">
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-[#36F1A2] text-[#235F72] px-6 py-3 rounded-lg hover:bg-[#2dd191] transition duration-200 font-semibold"
            >
              Manage Categories
            </button>
            <button
              onClick={openAddSampleTypeModal}
              className="bg-[#36F1A2] text-[#235F72] px-6 py-3 rounded-lg hover:bg-[#2dd191] transition duration-200 font-semibold"
            >
              Manage Sample Types
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#235F72] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold"
            >
              Add New Test
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tests by name, category, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Tests List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Test Name
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Category
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Price
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Sample Type
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Status
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => (
                <tr
                  key={test.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-4">
                    <div className="font-medium text-[#235F72] text-sm">
                      {test.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {test.description}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                      {test.category_name || "Uncategorized"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-green-600 text-sm">
                      {formatPrice(test.price)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600 capitalize">
                      {test.sample_type_name || "N/A"}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        test.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {test.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleShowQuestions(test.id)}
                        className="text-[#36F1A2] hover:text-[#2dd191] font-medium text-sm"
                      >
                        Questions
                      </button>
                      <span className="text-gray-300">|</span>

                      <button
                        onClick={() => handleShowParameters(test.id)}
                        className="text-[#085DB6] hover:text-[#074a9b] font-medium text-sm"
                      >
                        Parameters
                      </button>
                      <span className="text-gray-300">|</span>
                      {/* <button
                        onClick={() => handleShowRanges(parameter.id)}
                        className="text-[#36F1A2] hover:text-[#2dd191] font-medium text-sm"
                      >
                        Ranges
                      </button>
                      <span className="text-gray-300">|</span> */}
                      <button
                        onClick={() => handleEditTest(test)}
                        className="text-[#085DB6] hover:text-[#074a9b] font-medium text-sm"
                      >
                        Edit
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => setShowDeleteConfirm(test.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🧪</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Tests Found
            </h3>
            <p className="text-gray-500">
              {tests.length === 0
                ? "No tests available. Add your first test to get started."
                : "Try adjusting your search criteria."}
            </p>
          </div>
        )}
      </div>

      {/* Add Test Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#235F72]">
                  Add New Test
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Name *
                  </label>
                  <input
                    type="text"
                    value={newTest.name}
                    onChange={(e) =>
                      setNewTest({ ...newTest, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="e.g., Complete Blood Count"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={newTest.category_id}
                    onChange={(e) =>
                      setNewTest({ ...newTest, category_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {testCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTest.description}
                    onChange={(e) =>
                      setNewTest({ ...newTest, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="Test description"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sample Type *
                    </label>
                    <select
                      value={newTest.sample_type_id}
                      onChange={(e) =>
                        setNewTest({
                          ...newTest,
                          sample_type_id: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    >
                      <option value="">Select Sample Type</option>
                      {sampleTypes && sampleTypes.length > 0 ? (
                        sampleTypes
                          .filter((st) => st && st.id)
                          .map((st) => (
                            <option key={st.id} value={st.id}>
                              {st.name}
                            </option>
                          ))
                      ) : (
                        <option value="" disabled>
                          Loading sample types...
                        </option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tube Type
                    </label>
                    <select
                      value={newTest.tube_type}
                      onChange={(e) =>
                        setNewTest({ ...newTest, tube_type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    >
                      {tubeTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Processing Time
                    </label>
                    <input
                      type="text"
                      value={newTest.processing_time}
                      onChange={(e) =>
                        setNewTest({
                          ...newTest,
                          processing_time: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="e.g., 2-4 hours"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (ETB)
                    </label>
                    <input
                      type="number"
                      value={newTest.price}
                      onChange={(e) =>
                        setNewTest({ ...newTest, price: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="350"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testing Modes
                    </label>
                    <select
                      value={newTest.testing_modes}
                      onChange={(e) =>
                        setNewTest({
                          ...newTest,
                          testing_modes: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    >
                      {testingModes.map((mode) => (
                        <option key={mode} value={mode}>
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sample Volume
                    </label>
                    <input
                      type="text"
                      value={newTest.sample_volume}
                      onChange={(e) =>
                        setNewTest({
                          ...newTest,
                          sample_volume: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="e.g., 3-5 mL"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Linear Range
                  </label>
                  <input
                    type="text"
                    value={newTest.linear_range}
                    onChange={(e) =>
                      setNewTest({ ...newTest, linear_range: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="e.g., 5-100 ng/mL"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTest}
                  className="px-6 py-3 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold"
                >
                  Add Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Test Modal */}
      {editingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#235F72]">Edit Test</h2>
                <button
                  onClick={() => setEditingTest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Name *
                  </label>
                  <input
                    type="text"
                    value={editingTest.name}
                    onChange={(e) =>
                      setEditingTest({ ...editingTest, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={editingTest.category_id}
                    onChange={(e) =>
                      setEditingTest({
                        ...editingTest,
                        category_id: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {testCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editingTest.description}
                    onChange={(e) =>
                      setEditingTest({
                        ...editingTest,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sample Type *
                    </label>
                    <select
                      value={editingTest.sample_type_id}
                      onChange={(e) =>
                        setEditingTest({
                          ...editingTest,
                          sample_type_id: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    >
                      <option value="">Select Sample Type</option>
                      {sampleTypes.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (ETB)
                    </label>
                    <input
                      type="number"
                      value={editingTest.price}
                      onChange={(e) =>
                        setEditingTest({
                          ...editingTest,
                          price: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingTest.is_active}
                      onChange={(e) =>
                        setEditingTest({
                          ...editingTest,
                          is_active: e.target.checked,
                        })
                      }
                      className="mr-2 text-[#36F1A2] focus:ring-[#36F1A2]"
                    />
                    <span className="text-sm text-gray-700">
                      Test is active
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setEditingTest(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTest}
                  className="px-6 py-3 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold"
                >
                  Update Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#235F72]">
                  Manage Categories
                </h2>
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Add Category Form */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-[#235F72] mb-4">
                  Add New Category
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="e.g., Hematology"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newCategory.description}
                      onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="Category description"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleAddCategory}
                    className="px-4 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200"
                  >
                    Add Category
                  </button>
                </div>
              </div>

              {/* Categories List */}
              <div>
                <h3 className="text-lg font-semibold text-[#235F72] mb-4">
                  Existing Categories
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 text-[#235F72] font-semibold text-sm">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 text-[#235F72] font-semibold text-sm">
                          Description
                        </th>
                        <th className="text-left py-3 px-4 text-[#235F72] font-semibold text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {testCategories.map((category) => (
                        <tr
                          key={category.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="font-medium text-[#235F72] text-sm">
                              {category.name}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-sm text-gray-600">
                              {category.description}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditCategory(category)}
                                className="text-[#085DB6] hover:text-[#074a9b] font-medium text-sm"
                              >
                                Edit
                              </button>
                              <span className="text-gray-300">|</span>
                              <button
                                onClick={() =>
                                  setShowCategoryDeleteConfirm(category.id)
                                }
                                className="text-red-600 hover:text-red-800 font-medium text-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#235F72]">
                Edit Category
              </h2>
              <button
                onClick={() => setEditingCategory(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={editingCategory.description}
                  onChange={(e) =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
                className="px-4 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200"
              >
                Update Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modals */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this test? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteTest(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete Test
              </button>
            </div>
          </div>
        </div>
      )}

      {showCategoryDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category? Tests in this
              category will become uncategorized.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCategoryDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCategory(showCategoryDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
      {showParameterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#235F72]">
                  Manage Test Parameters
                </h2>
                <button
                  onClick={() => handleCloseParameterModal(showParameterModal)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Current test info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-[#235F72] mb-2">
                  {tests.find((t) => t.id === showParameterModal)?.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {tests.find((t) => t.id === showParameterModal)?.description}
                </p>
              </div>

              {/* Add Parameter Form */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-[#235F72] mb-4">
                  Add New Parameter
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parameter Name *
                    </label>
                    <input
                      type="text"
                      value={newParameter.parameter_name}
                      onChange={(e) =>
                        setNewParameter({
                          ...newParameter,
                          parameter_name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="e.g., White Blood Cells"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={newParameter.unit}
                      onChange={(e) =>
                        setNewParameter({
                          ...newParameter,
                          unit: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="e.g., 10^9/L"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleAddParameter(showParameterModal)}
                    className="px-4 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200"
                  >
                    Add Parameter
                  </button>
                </div>
              </div>

              {/* Parameters List */}
              <div>
                <h3 className="text-lg font-semibold text-[#235F72] mb-4">
                  Test Parameters (
                  {getTestParameters(showParameterModal)?.length || 0})
                </h3>
                {parametersLoading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-600">Loading parameters...</div>
                  </div>
                ) : getTestParameters(showParameterModal)?.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-4xl mb-2">📊</div>
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">
                      No Parameters
                    </h4>
                    <p className="text-gray-500">
                      Add parameters to this test to get started.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                          <th className="text-left py-3 px-4 text-[#235F72] font-semibold text-sm">
                            Parameter Name
                          </th>
                          <th className="text-left py-3 px-4 text-[#235F72] font-semibold text-sm">
                            Unit
                          </th>
                          <th className="text-left py-3 px-4 text-[#235F72] font-semibold text-sm">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getTestParameters(showParameterModal).map(
                          (parameter) => (
                            <tr
                              key={parameter.id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div className="font-medium text-[#235F72] text-sm">
                                  {parameter.parameter_name}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm text-gray-600">
                                  {parameter.unit || "N/A"}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      handleShowRanges(parameter.id)
                                    }
                                    className="text-[#36F1A2] hover:text-[#2dd191] font-medium text-sm"
                                  >
                                    Ranges
                                  </button>
                                  <span className="text-gray-300">|</span>

                                  <button
                                    onClick={() =>
                                      handleEditParameter(parameter)
                                    }
                                    className="text-[#085DB6] hover:text-[#074a9b] font-medium text-sm"
                                  >
                                    Edit
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    onClick={() =>
                                      setShowParameterDeleteConfirm(
                                        parameter.id
                                      )
                                    }
                                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Parameter Modal */}
      {editingParameter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#235F72]">
                Edit Parameter
              </h2>
              <button
                onClick={() => setEditingParameter(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parameter Name *
                </label>
                <input
                  type="text"
                  value={editingParameter.parameter_name}
                  onChange={(e) =>
                    setEditingParameter({
                      ...editingParameter,
                      parameter_name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <input
                  type="text"
                  value={editingParameter.unit}
                  onChange={(e) =>
                    setEditingParameter({
                      ...editingParameter,
                      unit: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
              <button
                onClick={() => setEditingParameter(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateParameter}
                className="px-4 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200"
              >
                Update Parameter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parameter Delete Confirmation Modal */}
      {showParameterDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this parameter? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowParameterDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleDeleteParameter(showParameterDeleteConfirm)
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete Parameter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Questions Modal */}
      {/* Dynamic Questions Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#235F72]">
                  Manage Dynamic Questions
                </h2>
                <button
                  onClick={() => handleCloseQuestionModal(showQuestionModal)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Add Question Form */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-[#235F72] mb-4">
                  Add New Question
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text *
                    </label>
                    <input
                      type="text"
                      value={newQuestion.question_text}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          question_text: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="e.g., Patient Age Group"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Field Type
                    </label>
                    <select
                      value={newQuestion.field_type}
                      onChange={(e) =>
                        setNewQuestion({
                          ...newQuestion,
                          field_type: e.target.value,
                          // Reset options when field type changes
                          options:
                            e.target.value === "text"
                              ? []
                              : newQuestion.options,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    >
                      {fieldTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center mt-6">
                      <input
                        type="checkbox"
                        checked={newQuestion.is_required}
                        onChange={(e) =>
                          setNewQuestion({
                            ...newQuestion,
                            is_required: e.target.checked,
                          })
                        }
                        className="mr-2 text-[#36F1A2] focus:ring-[#36F1A2]"
                      />
                      <span className="text-sm text-gray-700">
                        Required field
                      </span>
                    </label>
                  </div>

                  {/* Options Input for non-text field types */}
                  {newQuestion.field_type !== "text" && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options * (One per line)
                      </label>
                      <textarea
                        value={newQuestion.options?.join("\n") || ""}
                        onChange={(e) => {
                          const options = e.target.value
                            .split("\n")
                            .map((opt) => opt.trim())
                            .filter((opt) => opt.length > 0);
                          setNewQuestion({
                            ...newQuestion,
                            options: options,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                        rows="4"
                        placeholder={`Enter options, one per line. For example:
Option 1
Option 2
Option 3`}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {newQuestion.field_type === "checkbox" &&
                          "For checkboxes, each line becomes a selectable option"}
                        {newQuestion.field_type === "radio" &&
                          "For radio buttons, each line becomes a selectable option"}
                        {newQuestion.field_type === "dropdown" &&
                          "For dropdown, each line becomes a selectable option"}
                      </p>
                      {newQuestion.options &&
                        newQuestion.options.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-600 font-medium">
                              Preview:
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {newQuestion.options.map((option, index) => (
                                <span
                                  key={index}
                                  className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                >
                                  {option}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleAddQuestion(showQuestionModal)}
                    disabled={
                      newQuestion.field_type !== "text" &&
                      (!newQuestion.options || newQuestion.options.length === 0)
                    }
                    className="px-4 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Question
                  </button>
                </div>
              </div>

              {/* Questions List */}
              <div>
                <h3 className="text-lg font-semibold text-[#235F72] mb-4">
                  Dynamic Questions (
                  {getTestQuestions(showQuestionModal)?.length || 0})
                </h3>
                {getTestQuestions(showQuestionModal)?.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-4xl mb-2">❓</div>
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">
                      No Questions
                    </h4>
                    <p className="text-gray-500">
                      Add dynamic questions to this test.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getTestQuestions(showQuestionModal).map((question) => (
                      <div
                        key={question.id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-[#235F72]">
                              {question.question_text}
                            </h4>
                            <div className="text-sm text-gray-600 mt-1">
                              Type: {question.field_type} | Required:{" "}
                              {question.is_required ? "Yes" : "No"}
                            </div>
                            {question.options &&
                              question.options.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-600 font-medium">
                                    Options:
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {question.options.map((option, index) => (
                                      <span
                                        key={index}
                                        className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                                      >
                                        {option}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditQuestion(question)}
                              className="text-[#085DB6] hover:text-[#074a9b] text-sm"
                            >
                              Edit
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() =>
                                setShowQuestionDeleteConfirm(question.id)
                              }
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#235F72]">
                  Edit Question
                </h2>
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Text *
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.question_text}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        question_text: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field Type
                  </label>
                  <select
                    value={editingQuestion.field_type}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        field_type: e.target.value,
                        options:
                          e.target.value === "text"
                            ? []
                            : editingQuestion.options,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  >
                    {fieldTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {editingQuestion.field_type !== "text" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Options * (One per line)
                    </label>
                    <textarea
                      value={editingQuestion.options?.join("\n") || ""}
                      onChange={(e) => {
                        const options = e.target.value
                          .split("\n")
                          .map((opt) => opt.trim())
                          .filter((opt) => opt.length > 0);
                        setEditingQuestion({
                          ...editingQuestion,
                          options: options,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      rows="4"
                      placeholder="Enter options, one per line"
                    />
                    {editingQuestion.options &&
                      editingQuestion.options.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-600 font-medium">
                            Preview:
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {editingQuestion.options.map((option, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                                {option}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingQuestion.is_required}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          is_required: e.target.checked,
                        })
                      }
                      className="mr-2 text-[#36F1A2] focus:ring-[#36F1A2]"
                    />
                    <span className="text-sm text-gray-700">
                      Required field
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateQuestion}
                  disabled={
                    editingQuestion.field_type !== "text" &&
                    (!editingQuestion.options ||
                      editingQuestion.options.length === 0)
                  }
                  className="px-4 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Update Question
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reference Ranges Modal */}
      {showRangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#235F72]">
                  Manage Reference Ranges
                </h2>
                <button
                  onClick={() => handleCloseRangeModal(showRangeModal)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Add Range Form */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-[#235F72] mb-4">
                  Add New Reference Range
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* In the Reference Ranges Modal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sample Type
                    </label>
                    <select
                      value={newRange.sample_type}
                      onChange={(e) =>
                        setNewRange({
                          ...newRange,
                          sample_type: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    >
                      <option value="">Select Sample Type</option>
                      {sampleTypes && sampleTypes.length > 0 ? (
                        sampleTypes
                          .filter((st) => st && st.id && st.name)
                          .map((st) => (
                            <option key={st.id} value={st.name}>
                              {st.name}
                            </option>
                          ))
                      ) : (
                        <option value="" disabled>
                          Loading sample types...
                        </option>
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={newRange.gender}
                      onChange={(e) =>
                        setNewRange({ ...newRange, gender: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    >
                      {genders.map((gender) => (
                        <option key={gender} value={gender}>
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Age
                    </label>
                    <input
                      type="number"
                      value={newRange.min_age}
                      onChange={(e) =>
                        setNewRange({ ...newRange, min_age: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Age
                    </label>
                    <input
                      type="number"
                      value={newRange.max_age}
                      onChange={(e) =>
                        setNewRange({ ...newRange, max_age: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Value *
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={newRange.min_value}
                      onChange={(e) =>
                        setNewRange({ ...newRange, min_value: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Value *
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={newRange.max_value}
                      onChange={(e) =>
                        setNewRange({ ...newRange, max_value: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="100.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Critical Low
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={newRange.critical_low}
                      onChange={(e) =>
                        setNewRange({
                          ...newRange,
                          critical_low: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Critical High
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      value={newRange.critical_high}
                      onChange={(e) =>
                        setNewRange({
                          ...newRange,
                          critical_high: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="100.0"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={newRange.unit}
                      onChange={(e) =>
                        setNewRange({ ...newRange, unit: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="e.g., mg/dL"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conditions
                    </label>
                    <textarea
                      value={newRange.conditions}
                      onChange={(e) =>
                        setNewRange({ ...newRange, conditions: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      rows="2"
                      placeholder="Special conditions or notes"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleAddRange(showRangeModal)}
                    className="px-4 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200"
                  >
                    Add Range
                  </button>
                </div>
              </div>

              {/* Ranges List */}
              <div>
                <h3 className="text-lg font-semibold text-[#235F72] mb-4">
                  Reference Ranges (
                  {getParameterRanges(showRangeModal)?.length || 0})
                </h3>
                {getParameterRanges(showRangeModal)?.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-4xl mb-2">📊</div>
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">
                      No Reference Ranges
                    </h4>
                    <p className="text-gray-500">
                      Add reference ranges for this parameter.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getParameterRanges(showRangeModal).map((range) => (
                      <div
                        key={range.id}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-[#235F72]">
                              {range.min_value} - {range.max_value} {range.unit}
                            </h4>
                            <div className="text-sm text-gray-600 mt-1">
                              Sample: {range.sample_type} | Gender:{" "}
                              {range.gender} | Age: {range.min_age || "0"}-
                              {range.max_age || "100"} | Critical:{" "}
                              {range.critical_low || "N/A"}-
                              {range.critical_high || "N/A"}
                            </div>
                            {range.conditions && (
                              <div className="text-sm text-gray-500 mt-1">
                                Conditions: {range.conditions}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditRange(range)}
                              className="text-[#085DB6] hover:text-[#074a9b] text-sm"
                            >
                              Edit
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() =>
                                setShowRangeDeleteConfirm(range.id)
                              }
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Question Delete Confirmation Modal */}
      {showQuestionDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this question? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowQuestionDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteQuestion(showQuestionDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Range Delete Confirmation Modal */}
      {showRangeDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this reference range? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRangeDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRange(showRangeDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete Range
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Sample Type Management Modal */}
      {showSampleTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#235F72]">
                  Manage Sample Types
                </h2>
                <button
                  onClick={() => {
                    setShowSampleTypeModal(false);
                    setEditingSampleType(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Add Sample Type Form */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-[#235F72] mb-4">
                  {editingSampleType
                    ? "Edit Sample Type"
                    : "Add New Sample Type"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sample Type Name *
                    </label>
                    <input
                      type="text"
                      value={newSampleType.name}
                      onChange={(e) =>
                        setNewSampleType({
                          ...newSampleType,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="e.g., Blood, Urine, Serum"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newSampleType.description}
                      onChange={(e) =>
                        setNewSampleType({
                          ...newSampleType,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                      placeholder="Sample type description"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={Number(newSampleType.is_active) === 1}
                      onChange={(e) =>
                        setNewSampleType({
                          ...newSampleType,
                          is_active: e.target.checked ? 1 : 0,
                        })
                      }
                      className="mr-2 text-[#36F1A2] focus:ring-[#36F1A2]"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleSaveSampleType}
                    className="px-4 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200"
                  >
                    {editingSampleType
                      ? "Update Sample Type"
                      : "Add Sample Type"}
                  </button>
                </div>
              </div>

              {/* Sample Types List */}
              <div>
                <h3 className="text-lg font-semibold text-[#235F72] mb-4">
                  Existing Sample Types
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 bg-gray-50">
                        <th className="text-left py-3 px-4 text-[#235F72] font-semibold text-sm">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 text-[#235F72] font-semibold text-sm">
                          Description
                        </th>
                        <th className="text-left py-3 px-4 text-[#235F72] font-semibold text-sm">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-[#235F72] font-semibold text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleTypes && sampleTypes.length > 0 ? (
                        sampleTypes
                          .filter((st) => st && st.id)
                          .map((st) => (
                            <tr
                              key={st.id}
                              className="border-b border-gray-100 hover:bg-gray-50"
                            >
                              <td className="py-3 px-4">
                                <div className="font-medium text-[#235F72] text-sm">
                                  {st.name || "N/A"}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="text-sm text-gray-600">
                                  {st.description || "No description"}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    st.is_active
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {st.is_active ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleEditSampleType(st)}
                                    className="text-[#085DB6] hover:text-[#074a9b] font-medium text-sm"
                                  >
                                    Edit
                                  </button>
                                  <span className="text-gray-300">|</span>
                                  <button
                                    onClick={() =>
                                      setShowSampleTypeDeleteConfirm(st.id)
                                    }
                                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="py-8 text-center text-gray-500"
                          >
                            No sample types found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Type Delete Confirmation Modal */}
      {showSampleTypeDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-[#235F72] mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this sample type? Tests using this
              sample type will need to be updated.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSampleTypeDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleDeleteSampleType(showSampleTypeDeleteConfirm)
                }
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete Sample Type
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagement;
