import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import patientService from "../../services/patientService";

export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await patientService.getAllPatients(auth.token);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patients"
      );
    }
  }
);

export const fetchPatientById = createAsyncThunk(
  "patients/fetchPatientById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await patientService.getPatientById(id, auth.token);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch patient"
      );
    }
  }
);

export const createPatient = createAsyncThunk(
  "patients/createPatient",
  async (patientData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await patientService.createPatient(
        patientData,
        auth.token
      );
      return response.data;
    } catch (error) {
      console.log("error", error.response);
      return rejectWithValue(
        error.response?.data?.errors || "Failed to create patient"
      );
    }
  }
);

export const updatePatient = createAsyncThunk(
  "patients/updatePatient",
  async ({ id, patientData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await patientService.updatePatient(
        id,
        patientData,
        auth.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update patient"
      );
    }
  }
);

export const searchPatients = createAsyncThunk(
  "patients/searchPatients",
  async (query, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await patientService.searchPatients(query, auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to search patients"
      );
    }
  }
);

const patientSlice = createSlice({
  name: "patients",
  initialState: {
    patients: [],
    currentPatient: null,
    loading: false,
    error: null,
    searchResults: [],
  },
  reducers: {
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Patients
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Patient by ID
      .addCase(fetchPatientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPatient = action.payload;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Patient
      .addCase(createPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.patients.push(action.payload);
      })
      .addCase(createPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Patient
      .addCase(updatePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatient.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.patients.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        if (
          state.currentPatient &&
          state.currentPatient.id === action.payload.id
        ) {
          state.currentPatient = action.payload;
        }
      })
      .addCase(updatePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search Patients
      .addCase(searchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentPatient, clearSearchResults, clearError } =
  patientSlice.actions;
export default patientSlice.reducer;
