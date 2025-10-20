import api from "./api";

const testService = {
  getAllTests: (filters = {}) => {
    return api.get("/tests", { params: filters });
  },

  getTestById: (id) => {
    return api.get(`/tests/${id}`);
  },

  getTestCategories: () => {
    return api.get("/test-categories");
  },

  createTest: (testData) => {
    return api.post("/tests", testData);
  },

  updateTest: (id, testData) => {
    return api.put(`/tests/${id}`, testData);
  },

  deleteTest: (id) => {
    return api.delete(`/tests/${id}`);
  },
};

export default testService;
