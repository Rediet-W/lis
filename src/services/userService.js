import api from "./api";

const userService = {
  getAllUsers: (filters = {}) => {
    return api.get("/users", { params: filters });
  },

  getUserById: (id) => {
    return api.get(`/users/${id}`);
  },

  createUser: (userData) => {
    return api.post("/users", userData);
  },

  updateUser: (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },

  deactivateUser: (id) => {
    return api.patch(`/users/${id}/deactivate`);
  },

  activateUser: (id) => {
    return api.patch(`/users/${id}/activate`);
  },

  getLaboratorists: () => {
    return api.get("/users/laboratorists");
  },
};

export default userService;
