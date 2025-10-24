import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getClinic, updateClinic } from "../../store/slices/clinicSlice";

const ClinicSettings = () => {
  const dispatch = useDispatch();
  const { clinic, loading, error } = useSelector((state) => state.clinic);
  console.log("clinic data:", clinic);
  const [clinicInfo, setClinicInfo] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    working_hours: "",
    about_text: "",
    logo_url: "",
  });
  const [testList, setTestList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingTests, setIsEditingTests] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load clinic data when component mounts
  useEffect(() => {
    dispatch(getClinic());
  }, [dispatch]);

  // Update form when clinic data is loaded
  useEffect(() => {
    if (clinic) {
      console.log("Setting clinic data:", clinic);
      setClinicInfo({
        name: clinic.name || "",
        address: clinic.address || "",
        phone: clinic.phone || "",
        email: clinic.email || "",
        working_hours: clinic.working_hours || "",
        about_text: clinic.about_text || "",
        logo_url: clinic.logo_url || "",
      });

      // Set test list if available
      if (clinic.test_list && Array.isArray(clinic.test_list)) {
        setTestList(clinic.test_list);
      } else {
        setTestList([]);
      }

      setIsInitialLoad(false);
    }
  }, [clinic]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [error]);

  const handleSave = async () => {
    try {
      // Prepare update data - only include fields that are being edited
      const updateData = { ...clinicInfo };

      // Only include test_list if we're editing tests
      if (isEditingTests) {
        updateData.test_list = testList;
      }

      console.log("Sending update data:", updateData);

      const result = await dispatch(updateClinic(updateData)).unwrap();
      console.log("Update result:", result);

      setIsEditing(false);
      setIsEditingTests(false);
      toast.success("Clinic settings updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Refresh clinic data to get updated values
      dispatch(getClinic());
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update clinic settings", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClinicInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestChange = (index, updates) => {
    setTestList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  // Keep your slug generator
  const generateSlug = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-");
  };

  // When adding a new test, keep total as a string so the input is editable
  const addNewTest = () => {
    setTestList((prev) => [
      ...prev,
      { name: "", slug: "", total: "", description: "" },
    ]);
  };

  const removeTest = (index) => {
    if (testList.length > 1) {
      setTestList((prev) => prev.filter((_, i) => i !== index));
    } else {
      toast.warning("At least one test is required", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCancel = () => {
    // Reset form to original clinic data
    if (clinic) {
      setClinicInfo({
        name: clinic.name || "",
        address: clinic.address || "",
        phone: clinic.phone || "",
        email: clinic.email || "",
        working_hours: clinic.working_hours || "",
        about_text: clinic.about_text || "",
        logo_url: clinic.logo_url || "",
      });

      if (clinic.test_list && Array.isArray(clinic.test_list)) {
        setTestList(clinic.test_list);
      } else {
        setTestList([]);
      }
    }
    setIsEditing(false);
    setIsEditingTests(false);
  };

  // Debug: Log state changes
  useEffect(() => {
    console.log("Current clinicInfo:", clinicInfo);
    console.log("Current testList:", testList);
    console.log("Editing states - info:", isEditing, "tests:", isEditingTests);
  }, [clinicInfo, testList, isEditing, isEditingTests]);

  // Show loading state during initial load
  if (isInitialLoad && loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#235F72]"></div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Loading Clinic Settings
              </h3>
              <p className="text-gray-500 mt-1">
                Fetching your clinic information...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if failed to load
  if (error && !clinicInfo.name) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Failed to Load Settings
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => dispatch(getClinic())}
              className="bg-[#235F72] text-white px-6 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Clinic Information Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Header with Edit Button */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-[#235F72]">
                Clinic Information
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your clinic's basic information and contact details
              </p>
            </div>
            <div className="flex space-x-3">
              {(isEditing || isEditingTests) && (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={() => {
                  if (isEditing || isEditingTests) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
                disabled={loading}
                className="bg-[#235F72] text-white px-6 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200 disabled:bg-gray-400"
              >
                {loading
                  ? "Saving..."
                  : isEditing || isEditingTests
                  ? "Save All Changes"
                  : "Edit Information"}
              </button>
            </div>
          </div>
        </div>

        {/* Clinic Information Form */}
        <div className="p-6 space-y-6">
          {/* Clinic Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clinic Name *
            </label>
            <input
              type="text"
              name="name"
              value={clinicInfo.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="Enter clinic name"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={clinicInfo.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="Enter clinic address"
              required
            />
          </div>

          {/* Contact Information - Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={clinicInfo.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={clinicInfo.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Working Hours *
            </label>
            <input
              type="text"
              name="working_hours"
              value={clinicInfo.working_hours}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="e.g., Mon-Fri: 7:00 AM - 7:00 PM, Sat: 8:00 AM - 4:00 PM, Sun: Closed"
              required
            />
          </div>

          {/* About Clinic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About Clinic
            </label>
            <textarea
              name="about_text"
              value={clinicInfo.about_text}
              onChange={handleChange}
              disabled={!isEditing}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="Describe your clinic's services, mission, and expertise..."
            />
          </div>

          {/* Logo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo URL
            </label>
            <div className="flex items-start space-x-4">
              <input
                type="url"
                name="logo_url"
                value={clinicInfo.logo_url}
                onChange={handleChange}
                disabled={!isEditing}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="https://example.com/logo.png"
              />
              {clinicInfo.logo_url && (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden border border-gray-300">
                  <img
                    src={clinicInfo.logo_url}
                    alt="Clinic Logo Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter the URL of your clinic's logo image
            </p>
          </div>
        </div>
      </div>

      {/* Test List Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-[#235F72]">
                Available Tests
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage the tests and services offered by your clinic
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditingTests(!isEditingTests)}
                disabled={loading}
                className="bg-[#235F72] text-white px-6 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200 disabled:bg-gray-400"
              >
                {isEditingTests ? "View Mode" : "Edit Tests"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {isEditingTests ? (
            <div className="space-y-4">
              {testList.map((test, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Test Name *
                      </label>
                      <input
                        type="text"
                        value={test.name || ""}
                        onChange={(e) => {
                          const name = e.target.value;
                          // Only auto-generate slug if it's empty (don’t overwrite user edits)
                          const nextSlug =
                            test.slug && test.slug.length > 0
                              ? test.slug
                              : generateSlug(name);
                          handleTestChange(index, { name, slug: nextSlug });
                        }}
                        onBlur={() => {
                          if (!test.slug && test.name) {
                            handleTestChange(index, {
                              slug: generateSlug(test.name),
                            });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent bg-white"
                        placeholder="Enter test name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug *
                      </label>
                      <input
                        type="text"
                        value={test.slug || ""}
                        onChange={(e) =>
                          handleTestChange(index, { slug: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent bg-white"
                        placeholder="test-slug"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Tests Available
                      </label>
                      <input
                        type="number"
                        value={test.total === 0 ? 0 : test.total || ""} // allow empty while typing
                        onChange={(e) => {
                          // keep as string while typing; normalize on save
                          handleTestChange(index, { total: e.target.value });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent bg-white"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => removeTest(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                        type="button"
                      >
                        Remove Test
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={test.description || ""}
                      onChange={(e) =>
                        handleTestChange(index, { description: e.target.value })
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent bg-white"
                      placeholder="Describe this test..."
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={addNewTest}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#235F72] hover:text-[#235F72] transition duration-200 bg-white"
                type="button"
              >
                + Add New Test
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testList.map((test, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200 bg-white"
                >
                  <h3 className="font-semibold text-[#235F72] mb-2">
                    {test.name || "Unnamed Test"}
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Slug:</span>{" "}
                      {test.slug || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Available:</span>{" "}
                      {test.total || 0}
                    </p>
                    {test.description && (
                      <p>
                        <span className="font-medium">Description:</span>{" "}
                        {test.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {testList.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No tests available. Click "Edit Tests" to add tests.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* System Information Section */}
      {clinic && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-[#235F72] mb-4">
            System Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Clinic ID:</span>
              <span className="ml-2 text-gray-600">{clinic.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Last Updated:</span>
              <span className="ml-2 text-gray-600">
                {clinic.updated_at
                  ? new Date(clinic.updated_at).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Created:</span>
              <span className="ml-2 text-gray-600">
                {clinic.created_at
                  ? new Date(clinic.created_at).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">
                Total Tests for Landing page:
              </span>
              <span className="ml-2 text-gray-600">{testList.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicSettings;
