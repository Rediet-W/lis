import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import clinicService from "../../services/clinicService";

export const getClinic = createAsyncThunk(
  "clinic/getClinic",
  async (_, { rejectWithValue }) => {
    try {
      const response = await clinicService.getClinic();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch clinic settings"
      );
    }
  }
);

export const updateClinic = createAsyncThunk(
  "clinic/updateClinic",
  async (clinicData, { rejectWithValue }) => {
    try {
      const response = await clinicService.updateClinic(clinicData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update clinic settings"
      );
    }
  }
);

const clinicSlice = createSlice({
  name: "clinic",
  initialState: {
    clinic: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Clinic
      .addCase(getClinic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClinic.fulfilled, (state, action) => {
        state.loading = false;
        state.clinic = action.payload;
      })
      .addCase(getClinic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Clinic
      .addCase(updateClinic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClinic.fulfilled, (state, action) => {
        state.loading = false;
        state.clinic = action.payload;
      })
      .addCase(updateClinic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = clinicSlice.actions;
export default clinicSlice.reducer;
