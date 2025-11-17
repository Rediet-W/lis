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

  // Category management
  createCategory: (categoryData) => {
    return api.post("/test-categories", categoryData);
  },

  updateCategory: (id, categoryData) => {
    return api.put(`/test-categories/${id}`, categoryData);
  },

  deleteCategory: (id) => {
    return api.delete(`/test-categories/${id}`);
  },

  // Test Parameters management
  createParameter: (parameterData) => {
    return api.post("/test-parameters", parameterData);
  },

  updateParameter: (id, parameterData) => {
    return api.put(`/test-parameters/${id}`, parameterData);
  },

  deleteParameter: (id) => {
    return api.delete(`/test-parameters/${id}`);
  },

  // Sample Types endpoints
  getAllSampleTypes: (activeOnly = true) =>
    api.get("/sample-types", { params: { active: activeOnly } }),

  getSampleTypeById: (id) => api.get(`/sample-types/${id}`),

  createSampleType: (sampleTypeData) =>
    api.post("/sample-types", sampleTypeData),

  updateSampleType: (id, sampleTypeData) =>
    api.put(`/sample-types/${id}`, sampleTypeData),

  deleteSampleType: (id) => api.delete(`/sample-types/${id}`),
};

export default testService;
