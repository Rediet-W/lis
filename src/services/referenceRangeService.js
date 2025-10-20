import api from "./api";

const referenceRangeService = {
  getAllReferenceRanges: (filters = {}) => {
    return api.get("/reference-ranges", { params: filters });
  },

  getReferenceRangeById: (id) => {
    return api.get(`/reference-ranges/${id}`);
  },

  createReferenceRange: (rangeData) => {
    return api.post("/reference-ranges", rangeData);
  },

  updateReferenceRange: (id, rangeData) => {
    return api.put(`/reference-ranges/${id}`, rangeData);
  },

  deleteReferenceRange: (id) => {
    return api.delete(`/reference-ranges/${id}`);
  },

  findByCriteria: (criteria) => {
    return api.get("/reference-ranges/find/criteria", { params: criteria });
  },
};

export default referenceRangeService;
