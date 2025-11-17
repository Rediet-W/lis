import api from "./api";

const attachAuth = (config = {}, token) => {
  if (!token) return config;
  return {
    ...config,
    headers: { ...(config.headers || {}), Authorization: `Bearer ${token}` },
  };
};

const pathologistReportService = {
  getAll: (filters = {}, token) =>
    api.get("/pathologist-reports", attachAuth({ params: filters }, token)),

  getById: (id, token) =>
    api.get(`/pathologist-reports/${id}`, attachAuth({}, token)),

  create: (data, token) =>
    api.post("/pathologist-reports", data, attachAuth({}, token)),

  update: (id, data, token) =>
    api.put(`/pathologist-reports/${id}`, data, attachAuth({}, token)),

  remove: (id, token) =>
    api.delete(`/pathologist-reports/${id}`, attachAuth({}, token)),
};

export default pathologistReportService;
