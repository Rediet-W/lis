import api from "./api";

const testOrderService = {
  getAllTestOrders: (filters = {}) => {
    return api.get("/test-orders", { params: filters });
  },

  getTestOrderById: (id) => {
    return api.get(`/test-orders/${id}`);
  },

  createTestOrder: (orderData) => {
    return api.post("/test-orders", orderData);
  },

  updateTestOrderStatus: (id, status) => {
    return api.patch(`/test-orders/${id}/status`, { status });
  },

  getPendingTestOrders: () => {
    return api.get("/test-orders/pending");
  },

  getTestOrderResults: (testOrderId) => {
    return api.get(`/test-orders/${testOrderId}/results`);
  },
};

export default testOrderService;
