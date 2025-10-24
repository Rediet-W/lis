import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import activityLogService from "../../services/activityLogService";

export const getActivityLogs = createAsyncThunk(
  "activityLogs/getActivityLogs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await activityLogService.getAllActivityLogs(params);
      // Support both { success, message, data } and direct array/object
      return response.data?.data ?? response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch activity logs"
      );
    }
  }
);

const activityLogSlice = createSlice({
  name: "activityLogs",
  initialState: {
    logs: null,
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
      .addCase(getActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
        state.error = null;
      })
      .addCase(getActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.logs = null;
      });
  },
});

export const { clearError } = activityLogSlice.actions;
export default activityLogSlice.reducer;
