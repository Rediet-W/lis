import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createPatient } from "../../store/slices/patientSlice";
import { fetchTests } from "../../store/slices/testSlice";
import { createUser } from "../../store/slices/userSlice";

const PatientRegistration = ({ onPatientRegistered }) => {
  const dispatch = useDispatch();
  const { tests, loading: testsLoading } = useSelector((state) => state.tests);
  const { loading: patientLoading } = useSelector((state) => state.patients);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    age: "",
    gender: "",
    address: "",
    emergency_contact: "",
    email: "",
    blood_type: "",
    known_allergies: "",
    chronic_conditions: "",
    current_medications: "",
  });

  const [cardNumber, setCardNumber] = useState(
    "CLN-" + Math.floor(1000 + Math.random() * 9000)
  );
  const [step, setStep] = useState(1);

  // Fetch tests on component mount
  useEffect(() => {
    dispatch(fetchTests());
  }, [dispatch]);

  const bloodTypes = [
    "A+",
    "A-",
    "B+",
    "B-",
    "AB+",
    "AB-",
    "O+",
    "O-",
    "unknown",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name || !formData.phone) {
      toast.error("Please fill in required fields: Full Name and Phone");
      return;
    }
    let newUserId = null;
    const tempPassword = (formData.phone || "").trim() || cardNumber; // fallback: use cardNumber if phone is empty

    try {
      const userPayload = {
        username: cardNumber,
        email: formData.email || null,
        phone: formData.phone,
        full_name: formData.full_name,
        role: "patient",
        password: tempPassword,
        is_active: 1,
      };

      const createdUser = await dispatch(createUser(userPayload)).unwrap();
      // unwrap may return the entity directly or {data: {...}}
      const normalizedUser = createdUser?.data ?? createdUser;
      newUserId = normalizedUser?.id;

      if (!newUserId) {
        toast.error("Failed to create user account");
        return;
      }
    } catch (err) {
      const msg = err?.message || "Failed to create user account";
      toast.error(msg);
      return;
    }

    try {
      // Create patient
      const patientPayload = {
        ...formData,
        card_number: cardNumber,
        user_id: newUserId,
      };

      const result = await dispatch(createPatient(patientPayload)).unwrap();

      // Normalize result to the patient object shape
      const createdPatient = result?.data ?? result;

      // Reflect server-assigned card number in UI
      setCardNumber(createdPatient.card_number || cardNumber);
      toast.success("Patient registered successfully!");

      // Move to step 2 and pass patient data
      if (onPatientRegistered) {
        onPatientRegistered(createdPatient);
      }
    } catch (error) {
      console.error("Failed to register patient:", error);
      toast.error("Failed to register patient");
    }
  };

  const isLoading = patientLoading;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#235F72] to-[#085DB6] text-white p-6 rounded-t-xl">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">Register New Patient</h1>
                <p className="text-blue-100">
                  Step 1: Complete patient information
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
            {/* Progress Steps */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step === 1
                      ? "bg-[#235F72] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <div className="ml-2 text-sm font-medium">Patient Info</div>
              </div>
              <div className="w-16 h-1 bg-gray-200 mx-4"></div>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step === 2
                      ? "bg-[#235F72] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <div className="ml-2 text-sm font-medium">Order Tests</div>
              </div>
            </div>

            {/* Patient Information Form */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-[#235F72] border-b pb-2">
                Patient Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
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
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="patient@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        age: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Type
                  </label>
                  <select
                    value={formData.blood_type}
                    onChange={(e) =>
                      setFormData({ ...formData, blood_type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                  >
                    <option value="">Select Blood Type</option>
                    {bloodTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={formData.emergency_contact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergency_contact: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="Emergency contact number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Known Allergies
                  </label>
                  <textarea
                    value={formData.known_allergies}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        known_allergies: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="List any known allergies"
                    rows="2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chronic Conditions
                  </label>
                  <textarea
                    value={formData.chronic_conditions}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        chronic_conditions: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="List any chronic conditions"
                    rows="2"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Medications
                  </label>
                  <textarea
                    value={formData.current_medications}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        current_medications: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent"
                    placeholder="List current medications"
                    rows="2"
                  />
                </div>
              </div>
            </div>

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
                disabled={isLoading}
                className="px-8 py-3 bg-[#235F72] text-white rounded-lg hover:bg-[#1a4a5a] transition duration-200 font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Registering..." : "Register Patient & Continue"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistration;
