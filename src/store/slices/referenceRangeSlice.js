import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import referenceRangeService from "../../services/referenceRangeService";
import { toast } from "react-toastify";

// Thunks for Reference Ranges
export const fetchReferenceRanges = createAsyncThunk(
  "referenceRanges/fetchReferenceRanges",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await referenceRangeService.getAllReferenceRanges(
        filters
      );
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch reference ranges";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchRangesByParameter = createAsyncThunk(
  "referenceRanges/fetchRangesByParameter",
  async (parameterId, { rejectWithValue }) => {
    try {
      // Use getAllReferenceRanges with parameter_id filter
      const response = await referenceRangeService.getAllReferenceRanges({
        parameter_id: parameterId,
      });
      return { parameterId, ranges: response.data.data };
    } catch (error) {
      console.log("Full error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch reference ranges";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const createReferenceRange = createAsyncThunk(
  "referenceRanges/createReferenceRange",
  async (rangeData, { rejectWithValue }) => {
    try {
      const response = await referenceRangeService.createReferenceRange(
        rangeData
      );
      toast.success(
        response.data.message || "Reference range created successfully"
      );
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to create reference range";
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        Object.values(validationErrors).forEach((err) => {
          toast.error(Array.isArray(err) ? err[0] : err);
        });
      } else {
        toast.error(errorMsg);
      }
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateReferenceRange = createAsyncThunk(
  "referenceRanges/updateReferenceRange",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await referenceRangeService.updateReferenceRange(
        id,
        data
      );
      toast.success(
        response.data.message || "Reference range updated successfully"
      );
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update reference range";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteReferenceRange = createAsyncThunk(
  "referenceRanges/deleteReferenceRange",
  async (id, { rejectWithValue }) => {
    try {
      const response = await referenceRangeService.deleteReferenceRange(id);
      toast.success(
        response.data.message || "Reference range deleted successfully"
      );
      return id;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete reference range";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const referenceRangeSlice = createSlice({
  name: "referenceRanges",
  initialState: {
    ranges: [],
    rangesByParameter: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRangesByParameter: (state, action) => {
      const parameterId = action.payload;
      delete state.rangesByParameter[parameterId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Ranges
      .addCase(fetchReferenceRanges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferenceRanges.fulfilled, (state, action) => {
        state.loading = false;
        state.ranges = action.payload;
      })
      .addCase(fetchReferenceRanges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Ranges by Parameter
      .addCase(fetchRangesByParameter.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRangesByParameter.fulfilled, (state, action) => {
        state.loading = false;
        const { parameterId, ranges } = action.payload;
        state.rangesByParameter[parameterId] = ranges;
      })
      .addCase(fetchRangesByParameter.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Range
      .addCase(createReferenceRange.fulfilled, (state, action) => {
        const newRange = action.payload;
        state.ranges.push(newRange);
        if (state.rangesByParameter[newRange.parameter_id]) {
          state.rangesByParameter[newRange.parameter_id].push(newRange);
        }
      })
      // Update Range
      .addCase(updateReferenceRange.fulfilled, (state, action) => {
        const updatedRange = action.payload;
        const index = state.ranges.findIndex((r) => r.id === updatedRange.id);
        if (index !== -1) {
          state.ranges[index] = updatedRange;
        }
        if (state.rangesByParameter[updatedRange.parameter_id]) {
          const paramIndex = state.rangesByParameter[
            updatedRange.parameter_id
          ].findIndex((r) => r.id === updatedRange.id);
          if (paramIndex !== -1) {
            state.rangesByParameter[updatedRange.parameter_id][paramIndex] =
              updatedRange;
          }
        }
      })
      // Delete Range
      .addCase(deleteReferenceRange.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.ranges = state.ranges.filter((r) => r.id !== deletedId);
        Object.keys(state.rangesByParameter).forEach((parameterId) => {
          state.rangesByParameter[parameterId] = state.rangesByParameter[
            parameterId
          ].filter((r) => r.id !== deletedId);
        });
      });
  },
});

export const { clearError, clearRangesByParameter } =
  referenceRangeSlice.actions;
export default referenceRangeSlice.reducer;
