import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import testParameterService from "../../services/testParameterService";
import { toast } from "react-toastify";

// Thunks for Test Parameters
export const fetchTestParameters = createAsyncThunk(
  "testParameters/fetchTestParameters",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await testParameterService.getAllTestParameters(filters);
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch parameters";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchParametersByTest = createAsyncThunk(
  "testParameters/fetchParametersByTest",
  async (testId, { rejectWithValue }) => {
    try {
      const response = await testParameterService.getByTest(testId);
      return { testId, parameters: response.data.data };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch parameters";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const createTestParameter = createAsyncThunk(
  "testParameters/createTestParameter",
  async (parameterData, { rejectWithValue }) => {
    try {
      const response = await testParameterService.createTestParameter(
        parameterData
      );
      toast.success(response.data.message || "Parameter created successfully");
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to create parameter";
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

export const updateTestParameter = createAsyncThunk(
  "testParameters/updateTestParameter",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await testParameterService.updateTestParameter(id, data);
      toast.success(response.data.message || "Parameter updated successfully");
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update parameter";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteTestParameter = createAsyncThunk(
  "testParameters/deleteTestParameter",
  async (id, { rejectWithValue }) => {
    try {
      const response = await testParameterService.deleteTestParameter(id);
      toast.success(response.data.message || "Parameter deleted successfully");
      return id;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete parameter";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const testParameterSlice = createSlice({
  name: "testParameters",
  initialState: {
    parameters: [],
    parametersByTest: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearParametersByTest: (state, action) => {
      const testId = action.payload;
      delete state.parametersByTest[testId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Parameters
      .addCase(fetchTestParameters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestParameters.fulfilled, (state, action) => {
        state.loading = false;
        state.parameters = action.payload;
      })
      .addCase(fetchTestParameters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Parameters by Test
      .addCase(fetchParametersByTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchParametersByTest.fulfilled, (state, action) => {
        state.loading = false;
        const { testId, parameters } = action.payload;
        state.parametersByTest[testId] = parameters;
      })
      .addCase(fetchParametersByTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Parameter
      .addCase(createTestParameter.fulfilled, (state, action) => {
        const newParameter = action.payload;
        state.parameters.push(newParameter);
        // Also add to the specific test's parameters if they're loaded
        if (state.parametersByTest[newParameter.test_id]) {
          state.parametersByTest[newParameter.test_id].push(newParameter);
        }
      })
      // Update Parameter
      .addCase(updateTestParameter.fulfilled, (state, action) => {
        const updatedParameter = action.payload;
        // Update in all parameters array
        const index = state.parameters.findIndex(
          (param) => param.id === updatedParameter.id
        );
        if (index !== -1) {
          state.parameters[index] = updatedParameter;
        }
        // Update in test-specific parameters
        if (state.parametersByTest[updatedParameter.test_id]) {
          const testIndex = state.parametersByTest[
            updatedParameter.test_id
          ].findIndex((param) => param.id === updatedParameter.id);
          if (testIndex !== -1) {
            state.parametersByTest[updatedParameter.test_id][testIndex] =
              updatedParameter;
          }
        }
      })
      // Delete Parameter
      .addCase(deleteTestParameter.fulfilled, (state, action) => {
        const deletedId = action.payload;
        // Remove from all parameters array
        state.parameters = state.parameters.filter(
          (param) => param.id !== deletedId
        );
        // Remove from all test-specific parameters
        Object.keys(state.parametersByTest).forEach((testId) => {
          state.parametersByTest[testId] = state.parametersByTest[
            testId
          ].filter((param) => param.id !== deletedId);
        });
      });
  },
});

export const { clearError, clearParametersByTest } = testParameterSlice.actions;
export default testParameterSlice.reducer;
