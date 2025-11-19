// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import all your components
import LandingPage from "./components/landing/LandingPage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
// Receptionist Components
import ReceptionistDashboard from "./components/receptionist/Dashboard";
import PatientRegistrationFlow from "./components/receptionist/PatientRegistrationFlow";
import PatientSearch from "./components/receptionist/PatientSearch";
import TestOrders from "./components/receptionist/TestOrders";
import PatientDetails from "./components/receptionist/PatientDetails";
import Visits from "./components/receptionist/Visits";
import TestOrdersList from "./components/receptionist/TestOrdersList";

// Laboratory Components
import TestWorkbench from "./components/laboratory/TestWorkbench";
import ResultEntryForm from "./components/laboratory/ResultEntryForm";
import PathologistReportsList from "./components/pathologist/PathologistReportsList";

// Patient Components
import PatientDashboard from "./components/patient/Dashboard";
import PatientProfile from "./components/patient/ProfilePage";
import PatientTestHistory from "./components/patient/TestHistory";

// Admin Components
import AdminDashboard from "./components/admin/Dashboard";
import UserManagement from "./components/admin/UserManagement";
import TestManagement from "./components/admin/TestManagement";
import ActivityLogs from "./components/admin/ActivityLogs";
import ClinicSettings from "./components/admin/ClinicSettings";

// Common Components
import Header from "./components/common/Header";
import Sidebar from "./components/common/Sidebar";

import { useLocation } from "react-router-dom";
import PrintReportPage from "./components/reports/printReportPage";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // console.log("no user");
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// In AppLayout:
const AppLayout = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const location = useLocation();

  // Map paths to tab ids
  const pathToTab = (pathname) => {
    if (pathname.startsWith("/receptionist/dashboard")) return "dashboard";
    if (pathname.startsWith("/receptionist/register-patient"))
      return "register";
    if (pathname.startsWith("/receptionist/search-patient")) return "search";
    if (pathname.startsWith("/receptionist/test-orders")) return "orders";
    if (pathname.startsWith("/receptionist/today-visits")) return "visits";
    if (pathname.startsWith("/receptionist/test-order-list")) return "orders";
    if (pathname.startsWith("/receptionist/test-orders")) return "orders";

    if (pathname.startsWith("/laboratory/pending-tests")) return "pending";
    if (pathname.startsWith("/laboratory/completed-tests")) return "completed";
    if (pathname.startsWith("/laboratory/results-history")) return "history";
    if (pathname.startsWith("/patient/dashboard")) return "dashboard";
    if (pathname.startsWith("/patient/results")) return "results";
    if (pathname.startsWith("/patient/profile")) return "profile";
    if (pathname.startsWith("/patient/history")) return "history";
    if (pathname.startsWith("/admin/dashboard")) return "dashboard";
    if (pathname.startsWith("/admin/users")) return "users";
    if (pathname.startsWith("/admin/tests")) return "tests";
    if (pathname.startsWith("/admin/clinic-settings")) return "clinic";
    if (pathname.startsWith("/admin/activity-logs")) return "activity";
    if (pathname.startsWith("/admin/system-settings")) return "system";
    return "";
  };

  const [activeTab, setActiveTab] = React.useState(() =>
    pathToTab(location.pathname)
  );

  React.useEffect(() => {
    setActiveTab(pathToTab(location.pathname));
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 overflow-auto">
        <Header
          title={title}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        {children}
      </div>
    </div>
  );
};

// Wrap your app with Redux Provider
const AppContent = () => {
  return (
    <AuthProvider>
      <div className="App">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
          containerStyle={{ zIndex: 999999 }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          {/* Receptionist Routes */}
          <Route
            path="/receptionist/dashboard"
            element={
              <ProtectedRoute allowedRoles={["receptionist", "admin"]}>
                <AppLayout title="Receptionist Dashboard">
                  <ReceptionistDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/register-patient"
            element={
              <ProtectedRoute allowedRoles={["receptionist", "admin"]}>
                <AppLayout title="Register Patient">
                  <PatientRegistrationFlow />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/search-patient"
            element={
              <ProtectedRoute allowedRoles={["receptionist", "admin"]}>
                <AppLayout title="Search Patient">
                  <PatientSearch />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/test-orders"
            element={
              <ProtectedRoute allowedRoles={["receptionist", "admin"]}>
                <AppLayout title="Test Orders">
                  <TestOrders />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/patient-details/:id"
            element={
              <ProtectedRoute allowedRoles={["receptionist", "admin"]}>
                <AppLayout title="Patient Details">
                  <PatientDetails />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/visits"
            element={
              <ProtectedRoute allowedRoles={["receptionist", "admin"]}>
                <AppLayout title="Visits">
                  <Visits />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receptionist/test-order-list"
            element={
              <ProtectedRoute allowedRoles={["receptionist", "admin"]}>
                <AppLayout title="Test Orders">
                  <TestOrdersList />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          {/* Laboratory Routes 
          <Route
            path="/laboratory/dashboard"
            element={
              <ProtectedRoute allowedRoles={["laboratorist", "admin"]}>
                <AppLayout title="Laboratory Dashboard">
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />*/}
          {/* <Route
            path="/laboratory/pending-tests"
            element={
              <ProtectedRoute allowedRoles={["laboratorist", "admin"]}>
                <AppLayout title="Pending Tests">
                  <PendingTests />
                </AppLayout>
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/laboratory/workbench"
            element={
              <ProtectedRoute allowedRoles={["laboratorist", "admin"]}>
                <AppLayout>
                  <TestWorkbench />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/laboratory/enter-results"
            element={
              <ProtectedRoute allowedRoles={["laboratorist", "admin"]}>
                <AppLayout title="Enter Test Results">
                  <ResultEntryForm />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/pathologist"
            element={
              <ProtectedRoute
                allowedRoles={["laboratorist", "admin", "pathologist"]}
              >
                <AppLayout title="Pathologist Reports">
                  <PathologistReportsList />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          {/* Patient Routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <AppLayout title="Patient Portal">
                  <PatientDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <AppLayout title="My Profile">
                  <PatientProfile />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/history"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <AppLayout title="Test History">
                  <PatientTestHistory />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout title="Admin Dashboard">
                  <AdminDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout title="User Management">
                  <UserManagement />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tests"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout title="Test Management">
                  <TestManagement />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activity-logs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout title="Activity Logs">
                  <ActivityLogs />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clinic-settings"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AppLayout title="Clinic Settings">
                  <ClinicSettings />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/print-report"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "laboratorist",
                  "receptionist",
                  "patient",
                ]}
              >
                <PrintReportPage />
              </ProtectedRoute>
            }
          />
          {/* Fallback Routes */}
          <Route
            path="/receptionist"
            element={<Navigate to="/receptionist/dashboard" replace />}
          />
          <Route
            path="/laboratory"
            element={<Navigate to="/laboratory/workbench" replace />}
          />
          <Route
            path="/patient"
            element={<Navigate to="/patient/dashboard" replace />}
          />
          <Route
            path="/admin"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

// Unauthorized Page Component
const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          You don't have permission to access this page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#235F72] text-white px-6 py-2 rounded-lg hover:bg-[#1a4a5a] transition duration-200"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

// Main App Component with Redux Provider
function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
