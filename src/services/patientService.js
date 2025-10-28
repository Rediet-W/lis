import api from "./api";

const patientService = {
  getAllPatients: () => {
    return api.get("/patients");
  },

  getPatientById: (id) => {
    return api.get(`/patients/${id}`);
  },

  createPatient: (patientData) => {
    return api.post("/patients", patientData);
  },

  updatePatient: (id, patientData) => {
    return api.put(`/patients/${id}`, patientData);
  },

  searchPatients: (query) => {
    return api.get("/patients/search", { params: { q: query } });
  },

  getMyPatient: () => api.get("/patients/me"),
  updateMyPatient: (data) => api.put("/patients/me", data),
};

export default patientService;
