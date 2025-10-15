import React, { useState } from "react";

const TestManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Sample initial tests with prices and enhanced fields
  const [tests, setTests] = useState([
    {
      id: 1,
      productClass: "Vitamin",
      testName: "Vitamin D",
      description: "Measures Vitamin D levels in blood",
      price: 250,
      specimenType: "Blood",
      mixing: "-",
      mixture: "5",
      reactionTime: "15 min",
      linearRange: "5-100 ng/mL",
      clinicalReference: "30-100 ng/mL",
      antiregulant: "EDTA",
      category: "hematology",
      sampleType: "Whole Blood",
      tubeType: "EDTA",
      processingTime: "2-4 hours",
      dynamicQuestions: [
        {
          id: "age_range",
          question: "Patient Age Group",
          type: "radio",
          options: [
            "Child (0-12)",
            "Teen (13-19)",
            "Adult (20-59)",
            "Senior (60+)",
          ],
          required: true,
        },
      ],
    },
    {
      id: 2,
      productClass: "Inflammation",
      testName: "CRP",
      description: "C-reactive protein test for inflammation",
      price: 180,
      specimenType: "Serum",
      mixing: "8.5 μL",
      mixture: "10 Times",
      reactionTime: "3 min",
      linearRange: "0.5-200 mg/L",
      clinicalReference: "0-10 mg/L",
      antiregulant: "Heparin, Sodium Citrate",
      category: "biochemistry",
      sampleType: "Serum",
      tubeType: "Red Top",
      processingTime: "1-2 hours",
      dynamicQuestions: [],
    },
    {
      id: 3,
      productClass: "Diabetes",
      testName: "HbA1c",
      description: "Hemoglobin A1c test for diabetes monitoring",
      price: 200,
      specimenType: "Whole Blood",
      mixing: "10 μL",
      mixture: "10 Times",
      reactionTime: "5 min",
      linearRange: "4.0-14.5%",
      clinicalReference: "0-6.5%",
      antiregulant: "EDTA",
      category: "diabetes",
      sampleType: "Whole Blood",
      tubeType: "EDTA",
      processingTime: "2-3 hours",
      dynamicQuestions: [
        {
          id: "fasting",
          question: "Fasting Status",
          type: "radio",
          options: ["Fasting", "Non-fasting"],
          required: false,
        },
      ],
    },
    {
      id: 4,
      productClass: "Thyroid Function",
      testName: "T3",
      description: "Triiodothyronine thyroid hormone test",
      price: 300,
      specimenType: "Serum",
      mixing: "75 μL",
      mixture: "10 Times",
      reactionTime: "15 min",
      linearRange: "0.4-9.12 nmol/L",
      clinicalReference: "1.3-3.1 nmol/L",
      antiregulant: "Heparin, Sodium Citrate",
      category: "hormones",
      sampleType: "Serum",
      tubeType: "Red Top",
      processingTime: "24 hours",
      dynamicQuestions: [],
    },
  ]);

  const [newTest, setNewTest] = useState({
    productClass: "",
    testName: "",
    description: "",
    price: "",
    specimenType: "",
    mixing: "",
    mixture: "",
    reactionTime: "",
    linearRange: "",
    clinicalReference: "",
    antiregulant: "",
    category: "",
    sampleType: "",
    tubeType: "",
    processingTime: "",
    dynamicQuestions: [],
  });

  const categories = [
    "hematology",
    "biochemistry",
    "diabetes",
    "infectious",
    "urinalysis",
    "hormones",
    "immunology",
    "molecular",
  ];

  const specimenTypes = [
    "Blood",
    "Serum",
    "Plasma",
    "Urine",
    "Whole Blood",
    "Other",
  ];
  const tubeTypes = [
    "EDTA",
    "Heparin",
    "Sodium Citrate",
    "Red Top",
    "Urine Container",
    "Other",
  ];

  const filteredTests = tests.filter(
    (test) =>
      test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.productClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTest = () => {
    if (!newTest.testName || !newTest.productClass || !newTest.price) {
      alert(
        "Please fill in required fields: Test Name, Product Class, and Price"
      );
      return;
    }

    const testToAdd = {
      ...newTest,
      id: tests.length + 1,
      price: parseFloat(newTest.price),
      dynamicQuestions: newTest.dynamicQuestions || [],
    };

    setTests([...tests, testToAdd]);
    setNewTest({
      productClass: "",
      testName: "",
      description: "",
      price: "",
      specimenType: "",
      mixing: "",
      mixture: "",
      reactionTime: "",
      linearRange: "",
      clinicalReference: "",
      antiregulant: "",
      category: "",
      sampleType: "",
      tubeType: "",
      processingTime: "",
      dynamicQuestions: [],
    });
    setShowAddModal(false);
  };

  const handleEditTest = (test) => {
    setEditingTest({ ...test });
  };

  const handleUpdateTest = () => {
    if (
      !editingTest.testName ||
      !editingTest.productClass ||
      !editingTest.price
    ) {
      alert("Please fill in required fields");
      return;
    }

    setTests(
      tests.map((test) =>
        test.id === editingTest.id
          ? { ...editingTest, price: parseFloat(editingTest.price) }
          : test
      )
    );
    setEditingTest(null);
  };

  const handleDeleteTest = (testId) => {
    setTests(tests.filter((test) => test.id !== testId));
    setShowDeleteConfirm(null);
  };

  const addDynamicQuestion = () => {
    setNewTest((prev) => ({
      ...prev,
      dynamicQuestions: [
        ...prev.dynamicQuestions,
        {
          id: `q${Date.now()}`,
          question: "",
          type: "radio",
          options: [""],
          required: false,
        },
      ],
    }));
  };

  const updateDynamicQuestion = (index, field, value) => {
    setNewTest((prev) => ({
      ...prev,
      dynamicQuestions: prev.dynamicQuestions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      ),
    }));
  };

  const addQuestionOption = (questionIndex) => {
    setNewTest((prev) => ({
      ...prev,
      dynamicQuestions: prev.dynamicQuestions.map((q, i) =>
        i === questionIndex ? { ...q, options: [...q.options, ""] } : q
      ),
    }));
  };

  const updateQuestionOption = (questionIndex, optionIndex, value) => {
    setNewTest((prev) => ({
      ...prev,
      dynamicQuestions: prev.dynamicQuestions.map((q, i) =>
        i === questionIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optionIndex ? value : opt
              ),
            }
          : q
      ),
    }));
  };

  const removeDynamicQuestion = (index) => {
    setNewTest((prev) => ({
      ...prev,
      dynamicQuestions: prev.dynamicQuestions.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center ">
          {/* Search */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 w-3/4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex-1">
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
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#235F72] text-white px-6 py-3 rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold"
          >
            Add New Test
          </button>
        </div>
      </div>

      {/* Tests List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Product Class
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Test Name
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Category
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Price (ETB)
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Sample Type
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Processing Time
                </th>
                <th className="text-left py-4 px-4 text-[#235F72] font-semibold text-sm">
                  Clinical Reference
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
                      {test.productClass}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-sm">{test.testName}</div>
                    <div className="text-xs text-gray-500">
                      {test.description}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full capitalize">
                      {test.category}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-green-600 text-sm">
                      ETB {test.price}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {test.sampleType}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600">
                      {test.processingTime}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600 max-w-xs">
                      {test.clinicalReference}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
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
              Try adjusting your search criteria or add a new test.
            </p>
          </div>
        )}
      </div>

      {/* Add Test Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Name *
                  </label>
                  <input
                    type="text"
                    value={newTest.testName}
                    onChange={(e) =>
                      setNewTest({ ...newTest, testName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="e.g., Complete Blood Count"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Class *
                  </label>
                  <input
                    type="text"
                    value={newTest.productClass}
                    onChange={(e) =>
                      setNewTest({ ...newTest, productClass: e.target.value })
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
                    value={newTest.description}
                    onChange={(e) =>
                      setNewTest({ ...newTest, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="Test description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (ETB) *
                  </label>
                  <input
                    type="number"
                    value={newTest.price}
                    onChange={(e) =>
                      setNewTest({ ...newTest, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newTest.category}
                    onChange={(e) =>
                      setNewTest({ ...newTest, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sample Type
                  </label>
                  <select
                    value={newTest.sampleType}
                    onChange={(e) =>
                      setNewTest({ ...newTest, sampleType: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  >
                    <option value="">Select Sample Type</option>
                    {specimenTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tube Type
                  </label>
                  <select
                    value={newTest.tubeType}
                    onChange={(e) =>
                      setNewTest({ ...newTest, tubeType: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  >
                    <option value="">Select Tube Type</option>
                    {tubeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Processing Time
                  </label>
                  <input
                    type="text"
                    value={newTest.processingTime}
                    onChange={(e) =>
                      setNewTest({ ...newTest, processingTime: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="e.g., 2-4 hours"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinical Reference Range
                  </label>
                  <input
                    type="text"
                    value={newTest.clinicalReference}
                    onChange={(e) =>
                      setNewTest({
                        ...newTest,
                        clinicalReference: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="e.g., 30-100 ng/mL"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Linear Range
                  </label>
                  <input
                    type="text"
                    value={newTest.linearRange}
                    onChange={(e) =>
                      setNewTest({ ...newTest, linearRange: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="e.g., 5-100 ng/mL"
                  />
                </div>
              </div>

              {/* Dynamic Questions Section */}
              <div className="mt-6 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-[#235F72]">
                    Dynamic Questions
                  </h3>
                  <button
                    type="button"
                    onClick={addDynamicQuestion}
                    className="bg-[#36F1A2] text-[#235F72] px-4 py-2 rounded-lg hover:bg-[#2dd191] transition duration-200 text-sm"
                  >
                    Add Question
                  </button>
                </div>

                {newTest.dynamicQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className="mb-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-[#235F72]">
                        Question {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeDynamicQuestion(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question Text
                        </label>
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) =>
                            updateDynamicQuestion(
                              index,
                              "question",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#36F1A2] focus:border-transparent"
                          placeholder="Enter question..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Question Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) =>
                            updateDynamicQuestion(index, "type", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#36F1A2] focus:border-transparent"
                        >
                          <option value="radio">Radio Buttons</option>
                          <option value="checkbox">Checkboxes</option>
                          <option value="text">Text Input</option>
                        </select>
                      </div>
                    </div>

                    {(question.type === "radio" ||
                      question.type === "checkbox") && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Options
                        </label>
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                updateQuestionOption(
                                  index,
                                  optIndex,
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-[#36F1A2] focus:border-transparent"
                              placeholder={`Option ${optIndex + 1}`}
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addQuestionOption(index)}
                          className="text-[#085DB6] hover:text-[#074a9b] text-sm"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}

                    <div className="mt-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={question.required}
                          onChange={(e) =>
                            updateDynamicQuestion(
                              index,
                              "required",
                              e.target.checked
                            )
                          }
                          className="mr-2 text-[#36F1A2] focus:ring-[#36F1A2]"
                        />
                        <span className="text-sm text-gray-700">
                          Required field
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
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
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Name *
                  </label>
                  <input
                    type="text"
                    value={editingTest.testName}
                    onChange={(e) =>
                      setEditingTest({
                        ...editingTest,
                        testName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Class *
                  </label>
                  <input
                    type="text"
                    value={editingTest.productClass}
                    onChange={(e) =>
                      setEditingTest({
                        ...editingTest,
                        productClass: e.target.value,
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
                    value={editingTest.description}
                    onChange={(e) =>
                      setEditingTest({
                        ...editingTest,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (ETB) *
                  </label>
                  <input
                    type="number"
                    value={editingTest.price}
                    onChange={(e) =>
                      setEditingTest({ ...editingTest, price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinical Reference Range
                  </label>
                  <input
                    type="text"
                    value={editingTest.clinicalReference}
                    onChange={(e) =>
                      setEditingTest({
                        ...editingTest,
                        clinicalReference: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  />
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

      {/* Delete Confirmation Modal */}
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagement;
