import {
  VISIT_STATUS,
  TEST_ORDER_STATUS,
  PRIORITY,
  TEST_RESULT_STATUS,
  USER_ROLES,
} from "./constants";

export const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusColor = (status) => {
  const statusColors = {
    [VISIT_STATUS.REGISTERED]: "blue",
    [VISIT_STATUS.SAMPLE_COLLECTED]: "orange",
    [VISIT_STATUS.IN_PROGRESS]: "purple",
    [VISIT_STATUS.COMPLETED]: "green",
    [VISIT_STATUS.CANCELLED]: "red",

    [TEST_ORDER_STATUS.ORDERED]: "blue",
    [TEST_ORDER_STATUS.SAMPLE_COLLECTED]: "orange",
    [TEST_ORDER_STATUS.IN_PROGRESS]: "purple",
    [TEST_ORDER_STATUS.COMPLETED]: "green",
    [TEST_ORDER_STATUS.CANCELLED]: "red",

    [TEST_RESULT_STATUS.NORMAL]: "green",
    [TEST_RESULT_STATUS.LOW]: "orange",
    [TEST_RESULT_STATUS.HIGH]: "red",
    [TEST_RESULT_STATUS.CRITICAL]: "red",

    [PRIORITY.ROUTINE]: "gray",
    [PRIORITY.URGENT]: "orange",
    [PRIORITY.EMERGENCY]: "red",
  };

  return statusColors[status] || "gray";
};

export const getStatusLabel = (status) => {
  const statusLabels = {
    [VISIT_STATUS.REGISTERED]: "Registered",
    [VISIT_STATUS.SAMPLE_COLLECTED]: "Sample Collected",
    [VISIT_STATUS.IN_PROGRESS]: "In Progress",
    [VISIT_STATUS.COMPLETED]: "Completed",
    [VISIT_STATUS.CANCELLED]: "Cancelled",

    [TEST_ORDER_STATUS.ORDERED]: "Ordered",
    [TEST_ORDER_STATUS.SAMPLE_COLLECTED]: "Sample Collected",
    [TEST_ORDER_STATUS.IN_PROGRESS]: "In Progress",
    [TEST_ORDER_STATUS.COMPLETED]: "Completed",
    [TEST_ORDER_STATUS.CANCELLED]: "Cancelled",

    [TEST_RESULT_STATUS.NORMAL]: "Normal",
    [TEST_RESULT_STATUS.LOW]: "Low",
    [TEST_RESULT_STATUS.HIGH]: "High",
    [TEST_RESULT_STATUS.CRITICAL]: "Critical",

    [PRIORITY.ROUTINE]: "Routine",
    [PRIORITY.URGENT]: "Urgent",
    [PRIORITY.EMERGENCY]: "Emergency",
  };

  return statusLabels[status] || status;
};

export const getRoleLabel = (role) => {
  const roleLabels = {
    [USER_ROLES.ADMIN]: "Administrator",
    [USER_ROLES.RECEPTIONIST]: "Receptionist",
    [USER_ROLES.LABORATORIST]: "Laboratorist",
    [USER_ROLES.PATIENT]: "Patient",
  };

  return roleLabels[role] || role;
};

export const calculateAge = (dateOfBirth) => {
  if (!dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

export const generateCardNumber = () => {
  const prefix = "FC";
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
