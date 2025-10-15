import React, { useState } from "react";

const PatientRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    emergencyContact: "",
  });

  const [selectedTests, setSelectedTests] = useState([]);
  const [dynamicAnswers, setDynamicAnswers] = useState({});
  const [cardNumber, setCardNumber] = useState(
    "CLN-" + Math.floor(1000 + Math.random() * 9000)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const testCategories = [
    { id: "all", name: "All Tests" },
    { id: "hematology", name: "Hematology" },
    { id: "biochemistry", name: "Biochemistry" },
    { id: "infectious", name: "Infectious Diseases" },
    { id: "urinalysis", name: "Urinalysis" },
    { id: "hormones", name: "Hormones" },
  ];

  const availableTests = [
    {
      id: 1,
      name: "Complete Blood Count (CBC)",
      category: "hematology",
      price: 250,
      description: "Evaluates overall health and detects disorders",
      referenceInfo: "Measures RBC, WBC, Hemoglobin, Hematocrit, Platelets",
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
      name: "Blood Glucose (Fasting)",
      category: "biochemistry",
      price: 120,
      description: "Measures blood sugar levels after fasting",
      referenceInfo: "Normal range: 70-100 mg/dL",
      sampleType: "Serum",
      tubeType: "Fluoride",
      processingTime: "1-2 hours",
      dynamicQuestions: [
        {
          id: "fasting_hours",
          question: "Fasting Duration",
          type: "radio",
          options: ["8 hours", "12 hours", "Overnight fasting"],
          required: true,
        },
      ],
    },
    {
      id: 3,
      name: "HIV Test",
      category: "infectious",
      price: 200,
      description: "HIV antibody/antigen screening test",
      referenceInfo: "Fourth generation ELISA test",
      sampleType: "Serum",
      tubeType: "Red Top",
      processingTime: "4-6 hours",
      dynamicQuestions: [
        {
          id: "consent",
          question: "Informed Consent",
          type: "checkbox",
          options: ["Patient provided informed consent for HIV testing"],
          required: true,
        },
        {
          id: "pretest_counseling",
          question: "Pre-test Counseling",
          type: "checkbox",
          options: ["Pre-test counseling provided"],
          required: true,
        },
      ],
    },
    {
      id: 4,
      name: "Malaria Test",
      category: "infectious",
      price: 150,
      description: "Rapid diagnostic test for malaria",
      referenceInfo: "Detects P.falciparum and P.vivax",
      sampleType: "Whole Blood",
      tubeType: "EDTA",
      processingTime: "30 minutes",
      dynamicQuestions: [
        {
          id: "symptoms",
          question: "Current Symptoms",
          type: "checkbox",
          options: [
            "Fever",
            "Headache",
            "Chills",
            "Sweating",
            "Fatigue",
            "Nausea",
          ],
          required: false,
        },
        {
          id: "travel_history",
          question: "Recent Travel",
          type: "text",
          placeholder: "Recent travel areas...",
          required: false,
        },
      ],
    },
    {
      id: 5,
      name: "Urine Analysis",
      category: "urinalysis",
      price: 130,
      description: "Complete physical, chemical and microscopic examination",
      referenceInfo:
        "Includes appearance, specific gravity, pH, protein, glucose, etc.",
      sampleType: "Urine",
      tubeType: "Urine Container",
      processingTime: "2-3 hours",
      dynamicQuestions: [
        {
          id: "pregnancy",
          question: "For female patients",
          type: "radio",
          options: ["Pregnant", "Not Pregnant", "Not Applicable"],
          required: false,
        },
        {
          id: "urinary_symptoms",
          question: "Urinary Symptoms",
          type: "checkbox",
          options: [
            "Painful urination",
            "Frequent urination",
            "Blood in urine",
            "Cloudy urine",
            "Strong odor",
          ],
          required: false,
        },
      ],
    },
    {
      id: 6,
      name: "Liver Function Test",
      category: "biochemistry",
      price: 350,
      description: "Comprehensive liver enzyme and function panel",
      referenceInfo:
        "Includes ALT, AST, ALP, Bilirubin, Albumin, Total Protein",
      sampleType: "Serum",
      tubeType: "Red Top",
      processingTime: "4-6 hours",
      dynamicQuestions: [
        {
          id: "alcohol",
          question: "Alcohol Consumption",
          type: "radio",
          options: ["Regular drinker", "Occasional drinker", "Non-drinker"],
          required: false,
        },
        {
          id: "medications",
          question: "Current Medications",
          type: "text",
          placeholder: "List any hepatotoxic medications...",
          required: false,
        },
      ],
    },
    {
      id: 7,
      name: "Thyroid Profile (TSH, T3, T4)",
      category: "hormones",
      price: 400,
      description: "Complete thyroid function assessment",
      referenceInfo: "Measures TSH, Free T3, Free T4 levels",
      sampleType: "Serum",
      tubeType: "Red Top",
      processingTime: "24 hours",
      dynamicQuestions: [
        {
          id: "thyroid_meds",
          question: "Thyroid Medications",
          type: "checkbox",
          options: [
            "Taking thyroid medications",
            "Not taking thyroid medications",
          ],
          required: false,
        },
      ],
    },
    {
      id: 8,
      name: "Kidney Function Test",
      category: "biochemistry",
      price: 280,
      description: "Evaluates kidney function and health",
      referenceInfo: "Includes Creatinine, Urea, Uric Acid, Electrolytes",
      sampleType: "Serum",
      tubeType: "Red Top",
      processingTime: "3-4 hours",
      dynamicQuestions: [
        {
          id: "kidney_history",
          question: "Kidney Disease History",
          type: "checkbox",
          options: [
            "History of kidney disease",
            "Diabetes",
            "Hypertension",
            "None",
          ],
          required: false,
        },
      ],
    },
  ];

  // Filter tests based on search and category
  const filteredTests = availableTests.filter((test) => {
    const matchesSearch =
      test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTestToggle = (test) => {
    if (selectedTests.find((t) => t.id === test.id)) {
      setSelectedTests(selectedTests.filter((t) => t.id !== test.id));
      // Remove dynamic answers for this test
      const newAnswers = { ...dynamicAnswers };
      delete newAnswers[test.id];
      setDynamicAnswers(newAnswers);
    } else {
      setSelectedTests([...selectedTests, test]);
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
    return selectedTests.reduce((total, test) => total + test.price, 0);
  };

  const renderDynamicQuestion = (testId, question) => {
    const currentAnswer = dynamicAnswers[testId]?.[question.id];

    switch (question.type) {
      case "radio":
        return (
          <div key={question.id} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {question.question} {question.required && "*"}
            </label>
            <div className="flex flex-wrap gap-2">
              {question.options.map((option) => (
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
                    required={question.required}
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
              {question.question} {question.required && "*"}
            </label>
            <div className="flex flex-wrap gap-2">
              {question.options.map((option) => (
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
              {question.question} {question.required && "*"}
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

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#235F72] to-[#085DB6] text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Register New Patient</h1>
              <p className="text-blue-100">
                Complete patient information and test requests
              </p>
            </div>
            <div className="bg-[#36F1A2] bg-opacity-20 border border-[#36F1A2] rounded-lg p-3">
              <div className="flex items-center space-x-4">
                <span className="text-[#235F72] font-semibold">
                  Card Number:
                </span>
                <span className="text-xl font-bold text-[#235F72]">
                  {cardNumber}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Personal Information - Compact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#235F72] border-b pb-2">
                Patient Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="+251 91 234 5678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="Full address"
                  />
                </div>
              </div>
            </div>

            {/* Test Selection Panel */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#235F72] border-b pb-2">
                Laboratory Tests
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
                  {testCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1 text-xs rounded-full transition duration-200 ${
                        selectedCategory === category.id
                          ? "bg-[#235F72] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tests List - Compact */}
              <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredTests.map((test) => (
                  <div
                    key={test.id}
                    className={`border-b border-gray-100 last:border-b-0 transition duration-200 ${
                      selectedTests.find((t) => t.id === test.id)
                        ? "bg-[#36F1A2] bg-opacity-10"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <input
                            type="checkbox"
                            checked={
                              !!selectedTests.find((t) => t.id === test.id)
                            }
                            onChange={() => handleTestToggle(test)}
                            className="mt-1 text-[#36F1A2] focus:ring-[#36F1A2]"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  {test.name}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1">
                                  {test.description}
                                </p>
                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                  <span>Sample: {test.sampleType}</span>
                                  <span>Time: {test.processingTime}</span>
                                  <span>Tube: {test.tubeType}</span>
                                </div>
                              </div>

                              <div className="text-right ml-4">
                                <div className="font-bold text-[#235F72] text-lg">
                                  ETB {test.price}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {test.referenceInfo}
                                </div>
                              </div>
                            </div>

                            {/* Dynamic Questions - Appears when test is selected */}
                            {selectedTests.find((t) => t.id === test.id) &&
                              test.dynamicQuestions &&
                              test.dynamicQuestions.length > 0 && (
                                <div className="mt-3 p-3 bg-white border border-[#36F1A2] rounded-lg">
                                  <h5 className="font-medium text-[#235F72] text-xs mb-2">
                                    Additional Information Required:
                                  </h5>
                                  <div className="space-y-2">
                                    {test.dynamicQuestions.map((question) =>
                                      renderDynamicQuestion(test.id, question)
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Tests Summary */}
          {selectedTests.length > 0 && (
            <div className="border-t pt-6">
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                <h4 className="font-semibold text-[#085DB6] mb-3">
                  Order Summary ({selectedTests.length} tests selected)
                </h4>

                <div className="space-y-2 mb-4">
                  {selectedTests.map((test) => (
                    <div
                      key={test.id}
                      className="flex justify-between items-center py-2 border-b border-blue-100 last:border-b-0"
                    >
                      <div>
                        <span className="font-medium text-sm">{test.name}</span>
                        <div className="text-xs text-gray-600">
                          {test.referenceInfo}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[#235F72] font-semibold">
                          ETB {test.price}
                        </span>
                        <button
                          onClick={() => handleTestToggle(test)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
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
          <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
            <button
              type="button"
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold shadow-md"
            >
              Register Patient & Create Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;
