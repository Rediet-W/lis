import api from "./api";

const visitService = {
  getAllVisits: (filters = {}) => {
    return api.get("/visits", { params: filters });
  },

  getVisitById: (id) => {
    return api.get(`/visits/${id}`);
  },

  createVisit: (visitData) => {
    return api.post("/visits", visitData);
  },

  updateVisit: (id, visitData) => {
    return api.put(`/visits/${id}`, visitData);
  },

  updateVisitStatus: (id, status) => {
    return api.patch(`/visits/${id}/status`, { status });
  },

  getVisitTestOrders: (visitId) => {
    return api.get(`/visits/${visitId}/test-orders`);
  },
};

export default visitService;
