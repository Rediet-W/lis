import api from "./api";

const testResultService = {
  getAllTestResults: (filters = {}) => {
    return api.get("/test-results", { params: filters });
  },

  getTestResultById: (id) => {
    return api.get(`/test-results/${id}`);
  },

  createTestResult: (resultData) => {
    return api.post("/test-results", resultData);
  },

  updateTestResult: (id, resultData) => {
    return api.put(`/test-results/${id}`, resultData);
  },

  verifyTestResult: (id) => {
    return api.patch(`/test-results/${id}/verify`);
  },

  getParameterResults: (testResultId) => {
    return api.get(`/test-results/${testResultId}/parameters`);
  },
};

export default testResultService;
