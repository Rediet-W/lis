import api from "./api";

const clinicService = {
  getClinic: () => {
    return api.get("/clinic");
  },

  createClinic: (clinicData) => {
    return api.post("/clinic", clinicData);
  },

  updateClinic: (clinicData) => {
    return api.put("/clinic", clinicData);
  },
};

export default clinicService;
