import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { register, clearError } from "../../store/slices/authSlice";
import { Eye, EyeOff } from "lucide-react";
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    role: "patient",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // add
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // add

  const {
    loading,
    error: reduxError,
    user,
  } = useSelector((state) => state.auth);

  // Handle successful registration
  useEffect(() => {
    if (user && !loading) {
      toast.success(
        `Account created successfully! Welcome, ${user.full_name}!`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "receptionist":
          navigate("/receptionist/dashboard");
          break;
        case "laboratorist":
          navigate("/laboratory/dashboard");
          break;
        case "patient":
          navigate("/patient/dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    }
  }, [user, loading, navigate]);

  // Handle Redux errors
  useEffect(() => {
    if (reduxError) {
      toast.error(reduxError, {
        position: "top-right",
        autoClose: 5000,
      });
      dispatch(clearError());
    }
  }, [reduxError, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    } else if (formData.full_name.length < 2) {
      newErrors.full_name = "Full name must be at least 2 characters";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);

      // Show first error as toast
      const firstError = Object.values(formErrors)[0];
      toast.error(firstError, {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      // Prepare data for API (remove confirmPassword)
      const { confirmPassword, ...submitData } = formData;
      await dispatch(register(submitData)).unwrap();
      // Success is handled by useEffect
    } catch (error) {
      // Error is handled by Redux and useEffect
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#235F72] to-[#085DB6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="World Laboratory Service Logo"
              className="w-16 h-16 mr-3 rounded-full bg-white object-contain"
            />
            <span className="font-bold text-xl">World Laboratory Center</span>
          </div>
          <h1 className="text-2xl font-bold text-[#085DB6]">Create Account</h1>
          <p className="text-gray-600 mt-2">
            Join world laboratory center Laboratory System
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent outline-none transition duration-200 ${
                errors.full_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
            {errors.full_name && (
              <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent outline-none transition duration-200 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Choose a username"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent outline-none transition duration-200 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent outline-none transition duration-200 ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent outline-none transition duration-200 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Create a password (min. 6 characters)"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent outline-none transition duration-200 ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Role Selection (Hidden for self-registration - defaults to patient) */}
          <div className="hidden">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent outline-none transition duration-200"
            >
              <option value="patient">Patient</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-200 shadow-md ${
              loading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#235F72] text-white hover:bg-[#1a4a5a] hover:shadow-lg"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#085DB6] hover:text-[#074a9b] font-medium"
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-[#085DB6] hover:text-[#074a9b] text-sm flex items-center justify-center mx-auto"
          >
            ← Back to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
