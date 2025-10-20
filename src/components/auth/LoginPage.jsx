import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login, clearError, getProfile } from "../../store/slices/authSlice";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    loading,
    error: reduxError,
    isAuthenticated,
    user,
  } = useSelector((state) => state.auth);

  // Handle successful login redirection
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Login successful, redirecting...", user);
      setIsSubmitting(false);
      toast.success(`Welcome back, ${user.full_name}!`, {
        position: "top-right",
        autoClose: 3000,
      });

      // Redirect based on user role
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
  }, [isAuthenticated, user, navigate]);

  // Handle Redux errors
  useEffect(() => {
    if (reduxError) {
      console.log("Redux Error:", reduxError);
      setIsSubmitting(false);
      toast.error(reduxError, {
        position: "top-right",
        autoClose: 5000,
      });
      dispatch(clearError());
    }
  }, [reduxError, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Login attempt:", { email, password });
    setIsSubmitting(true);

    // Basic validation
    if (!email || !password) {
      toast.error("Please enter both email and password", {
        position: "top-right",
        autoClose: 5000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Dispatching login action...");
      const result = await dispatch(login({ email, password })).unwrap();
      if (result?.token && !result?.user) {
        await dispatch(getProfile());
      }
      console.log("Login successful:", result);
    } catch (error) {
      console.log("Login failed:", error);
      setIsSubmitting(false);
      // Error is handled by the Redux error state and useEffect
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#235F72] to-[#085DB6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#235F72] rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-10 h-10 bg-[#36F1A2] rounded-full"></div>
          </div>
          <h1 className="text-3xl font-bold text-[#085DB6]">FineCare</h1>
          <p className="text-gray-600 mt-2">Laboratory Information System</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent outline-none transition duration-200"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#36F1A2] focus:border-transparent outline-none transition duration-200"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-200 shadow-md ${
              isLoading
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#235F72] text-white hover:bg-[#1a4a5a] hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                Signing In...
              </div>
            ) : (
              "Sign In to Your Account"
            )}
          </button>
        </form>

        {/* Additional Options */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">Don't have an account?</p>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full border-2 border-[#36F1A2] text-[#235F72] py-3 rounded-lg font-semibold hover:bg-[#36F1A2] transition duration-200"
            >
              Create New Account
            </button>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
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

export default LoginPage;
