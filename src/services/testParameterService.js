import api from "./api";

const testParameterService = {
  getAllTestParameters: (filters = {}) => {
    return api.get("/test-parameters", { params: filters });
  },

  getTestParameterById: (id) => {
    return api.get(`/test-parameters/${id}`);
  },

  createTestParameter: (parameterData) => {
    return api.post("/test-parameters", parameterData);
  },

  updateTestParameter: (id, parameterData) => {
    return api.put(`/test-parameters/${id}`, parameterData);
  },

  deleteTestParameter: (id) => {
    return api.delete(`/test-parameters/${id}`);
  },

  getByTest: (testId) => {
    return api.get(`/test-parameters/test/${testId}`);
  },
};

export default testParameterService;
