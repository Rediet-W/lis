import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import parameterResultService from "../../services/parameterResultService";

// Async thunks
export const fetchParameterResults = createAsyncThunk(
  "parameterResults/fetch",
  async (testResultId, { rejectWithValue }) => {
    try {
      const response = await parameterResultService.getParameterResults(
        testResultId
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createParameterResult = createAsyncThunk(
  "parameterResults/create",
  async (paramResultData, { rejectWithValue }) => {
    try {
      const response = await parameterResultService.createParameterResult(
        paramResultData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateParameterResult = createAsyncThunk(
  "parameterResults/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await parameterResultService.updateParameterResult(
        id,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const parameterResultSlice = createSlice({
  name: "parameterResults",
  initialState: {
    parameterResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearParameterResults: (state) => {
      state.parameterResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchParameterResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParameterResults.fulfilled, (state, action) => {
        state.loading = false;
        state.parameterResults = action.payload;
      })
      .addCase(fetchParameterResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createParameterResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createParameterResult.fulfilled, (state, action) => {
        state.loading = false;
        state.parameterResults.push(action.payload);
      })
      .addCase(createParameterResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateParameterResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParameterResult.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.parameterResults.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.parameterResults[index] = action.payload;
        }
      })
      .addCase(updateParameterResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearParameterResults } =
  parameterResultSlice.actions;
export default parameterResultSlice.reducer;
