import api from "./api";

const dynamicQuestionService = {
  getAllDynamicQuestions: (filters = {}) => {
    return api.get("/dynamic-questions", { params: filters });
  },

  getDynamicQuestionById: (id) => {
    return api.get(`/dynamic-questions/${id}`);
  },

  createDynamicQuestion: (questionData) => {
    return api.post("/dynamic-questions", questionData);
  },

  updateDynamicQuestion: (id, questionData) => {
    return api.put(`/dynamic-questions/${id}`, questionData);
  },

  deleteDynamicQuestion: (id) => {
    return api.delete(`/dynamic-questions/${id}`);
  },

  getByTest: (testId) => {
    return api.get(`/dynamic-questions/test/${testId}`);
  },
};

export default dynamicQuestionService;
