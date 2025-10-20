import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import testResultService from "../../services/testResultService";

export const fetchTestResults = createAsyncThunk(
  "testResults/fetchTestResults",
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testResultService.getAllTestResults(
        filters,
        auth.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch test results"
      );
    }
  }
);

export const fetchTestResultById = createAsyncThunk(
  "testResults/fetchTestResultById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testResultService.getTestResultById(
        id,
        auth.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch test result"
      );
    }
  }
);

export const createTestResult = createAsyncThunk(
  "testResults/createTestResult",
  async (resultData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testResultService.createTestResult(
        resultData,
        auth.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create test result"
      );
    }
  }
);

export const updateTestResult = createAsyncThunk(
  "testResults/updateTestResult",
  async ({ id, resultData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testResultService.updateTestResult(
        id,
        resultData,
        auth.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update test result"
      );
    }
  }
);

export const verifyTestResult = createAsyncThunk(
  "testResults/verifyTestResult",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testResultService.verifyTestResult(id, auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to verify test result"
      );
    }
  }
);

export const fetchParameterResults = createAsyncThunk(
  "testResults/fetchParameterResults",
  async (testResultId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testResultService.getParameterResults(
        testResultId,
        auth.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch parameter results"
      );
    }
  }
);

const testResultSlice = createSlice({
  name: "testResults",
  initialState: {
    testResults: [],
    currentTestResult: null,
    parameterResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentTestResult: (state) => {
      state.currentTestResult = null;
    },
    clearParameterResults: (state) => {
      state.parameterResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Test Results
      .addCase(fetchTestResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestResults.fulfilled, (state, action) => {
        state.loading = false;
        state.testResults = action.payload;
      })
      .addCase(fetchTestResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Test Result by ID
      .addCase(fetchTestResultById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestResultById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTestResult = action.payload;
      })
      .addCase(fetchTestResultById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Test Result
      .addCase(createTestResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTestResult.fulfilled, (state, action) => {
        state.loading = false;
        state.testResults.push(action.payload);
      })
      .addCase(createTestResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Test Result
      .addCase(updateTestResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestResult.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.testResults.findIndex(
          (tr) => tr.id === action.payload.id
        );
        if (index !== -1) {
          state.testResults[index] = action.payload;
        }
        if (
          state.currentTestResult &&
          state.currentTestResult.id === action.payload.id
        ) {
          state.currentTestResult = action.payload;
        }
      })
      .addCase(updateTestResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Verify Test Result
      .addCase(verifyTestResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyTestResult.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.testResults.findIndex(
          (tr) => tr.id === action.payload.id
        );
        if (index !== -1) {
          state.testResults[index] = {
            ...state.testResults[index],
            ...action.payload,
          };
        }
        if (
          state.currentTestResult &&
          state.currentTestResult.id === action.payload.id
        ) {
          state.currentTestResult = {
            ...state.currentTestResult,
            ...action.payload,
          };
        }
      })
      .addCase(verifyTestResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Parameter Results
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
      });
  },
});

export const { clearCurrentTestResult, clearParameterResults, clearError } =
  testResultSlice.actions;
export default testResultSlice.reducer;
