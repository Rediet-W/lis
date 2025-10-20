import api from "./api";

const unwrap = (res) => res?.data?.data ?? res?.data;

const authService = {
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return unwrap(res); // -> { token, user? }
  },

  register: async (userData) => {
    const res = await api.post("/auth/register", userData);
    return unwrap(res);
  },

  getProfile: async () => {
    const res = await api.get("/auth/profile");
    // backend may return { user } or plain user
    const data = unwrap(res);
    return data?.user ?? data;
  },

  updateProfile: async (profileData) => {
    const res = await api.put("/auth/profile", profileData);
    return unwrap(res);
  },

  changePassword: async (passwordData) => {
    const res = await api.put("/auth/change-password", passwordData);
    return unwrap(res);
  },
};

export default authService;
