import api from "./api";

const parameterResultService = {
  getAllParameterResults: (filters = {}) => {
    return api.get("/parameter-results", { params: filters });
  },

  getParameterResultById: (id) => {
    return api.get(`/parameter-results/${id}`);
  },

  createParameterResult: (resultData) => {
    return api.post("/parameter-results", resultData);
  },

  batchCreateParameterResults: (parameterResults) => {
    return api.post("/parameter-results/batch", {
      parameter_results: parameterResults,
    });
  },

  updateParameterResult: (id, resultData) => {
    return api.put(`/parameter-results/${id}`, resultData);
  },

  deleteParameterResult: (id) => {
    return api.delete(`/parameter-results/${id}`);
  },

  getByTestResult: (testResultId) => {
    return api.get(`/parameter-results/test-result/${testResultId}`);
  },
};

export default parameterResultService;
