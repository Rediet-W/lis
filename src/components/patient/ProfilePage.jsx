import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchMyPatient,
  updateMyPatient,
} from "../../store/slices/patientSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();

  const { currentPatient, loading, error } = useSelector(
    (s) => s.patients || {}
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    // backend fields only
    full_name: "",
    card_number: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    address: "",
    emergency_contact: "",
    email: "",
    blood_type: "unknown",
    known_allergies: "",
    chronic_conditions: "",
    current_medications: "",
  });

  // Fetch profile
  useEffect(() => {
    dispatch(fetchMyPatient());
  }, [dispatch]);

  // Hydrate form from backend response
  useEffect(() => {
    if (!currentPatient) return;
    setFormData({
      full_name: currentPatient.full_name || "",
      card_number: currentPatient.card_number || "",
      date_of_birth: currentPatient.date_of_birth
        ? new Date(currentPatient.date_of_birth).toISOString().slice(0, 10)
        : "",
      gender: currentPatient.gender || "",
      phone: currentPatient.phone || "",
      address: currentPatient.address || "",
      emergency_contact: currentPatient.emergency_contact || "",
      email: currentPatient.email || "",
      blood_type: currentPatient.blood_type || "unknown",
      known_allergies: currentPatient.known_allergies || "",
      chronic_conditions: currentPatient.chronic_conditions || "",
      current_medications: currentPatient.current_medications || "",
    });
  }, [currentPatient]);

  const age = useMemo(() => {
    const dob = formData.date_of_birth;
    if (!dob) return null;
    const birth = new Date(dob);
    const today = new Date();
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  }, [formData.date_of_birth]);

  const handleSave = async () => {
    try {
      const {
        email: _omitEmail,
        phone: _omitPhone,
        card_number: _omitCardNumber,
        ...editable
      } = formData;

      await dispatch(
        updateMyPatient({
          ...editable,
          emergency_contact: editable.emergency_contact || null,
          known_allergies: editable.known_allergies || null,
          chronic_conditions: editable.chronic_conditions || null,
          current_medications: editable.current_medications || null,
          date_of_birth: editable.date_of_birth || null,
        })
      ).unwrap();
      setIsEditing(false);
      // refresh
      dispatch(fetchMyPatient());
    } catch (e) {
      // handled by slice; keep UI state intact
    }
  };

  const onChange = (k, v) => setFormData((p) => ({ ...p, [k]: v }));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#235F72]">My Profile</h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a]"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a]"
              disabled={loading || !currentPatient}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {String(error)}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Personal Information */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#235F72] mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => onChange("full_name", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                value={formData.card_number}
                disabled
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.date_of_birth || ""}
                onChange={(e) => onChange("date_of_birth", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
              <div className="text-xs text-gray-500 mt-1">
                Age: {formData.date_of_birth ? `${age} years` : "N/A"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={formData.gender || ""}
                onChange={(e) => onChange("gender", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                readonly
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => onChange("address", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                readonly
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="tel"
                value={formData.emergency_contact || ""}
                onChange={(e) => onChange("emergency_contact", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#235F72] mb-4">
            Medical Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Type
              </label>
              <select
                value={formData.blood_type || "unknown"}
                onChange={(e) => onChange("blood_type", e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              >
                {[
                  "unknown",
                  "A+",
                  "A-",
                  "B+",
                  "B-",
                  "AB+",
                  "AB-",
                  "O+",
                  "O-",
                ].map((bt) => (
                  <option key={bt} value={bt}>
                    {bt === "unknown" ? "Not Specified" : bt}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Known Allergies
              </label>
              <input
                type="text"
                value={formData.known_allergies || ""}
                onChange={(e) => onChange("known_allergies", e.target.value)}
                disabled={!isEditing}
                placeholder="List any known allergies"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chronic Conditions
              </label>
              <input
                type="text"
                value={formData.chronic_conditions || ""}
                onChange={(e) => onChange("chronic_conditions", e.target.value)}
                disabled={!isEditing}
                placeholder="List any chronic medical conditions"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Medications
              </label>
              <input
                type="text"
                value={formData.current_medications || ""}
                onChange={(e) =>
                  onChange("current_medications", e.target.value)
                }
                disabled={!isEditing}
                placeholder="List current medications"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Timestamps */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-700">Created At:</span>{" "}
              {currentPatient?.created_at
                ? new Date(currentPatient.created_at).toLocaleString()
                : "-"}
            </div>
            <div>
              <span className="font-medium text-gray-700">Updated At:</span>{" "}
              {currentPatient?.updated_at
                ? new Date(currentPatient.updated_at).toLocaleString()
                : "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
