import api from "./api";

const activityLogService = {
  getAllActivityLogs: (filters = {}) => {
    return api.get("/activity-logs", { params: filters });
  },

  getRecentActivities: (limit = 100) => {
    return api.get("/activity-logs/recent", { params: { limit } });
  },

  getUserActivities: (userId, limit = 50) => {
    return api.get(`/activity-logs/user/${userId}`, { params: { limit } });
  },

  logActivity: (logData) => {
    return api.post("/activity-logs", logData);
  },
};

export default activityLogService;
