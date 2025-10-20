import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import testService from "../../services/testService";

export const fetchTests = createAsyncThunk(
  "tests/fetchTests",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testService.getAllTests(auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch tests"
      );
    }
  }
);

export const fetchTestById = createAsyncThunk(
  "tests/fetchTestById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testService.getTestById(id, auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch test"
      );
    }
  }
);

export const fetchTestCategories = createAsyncThunk(
  "tests/fetchTestCategories",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testService.getTestCategories(auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch test categories"
      );
    }
  }
);

const testSlice = createSlice({
  name: "tests",
  initialState: {
    tests: [],
    testCategories: [],
    currentTest: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentTest: (state) => {
      state.currentTest = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tests
      .addCase(fetchTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTests.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = action.payload;
      })
      .addCase(fetchTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Test by ID
      .addCase(fetchTestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTest = action.payload;
      })
      .addCase(fetchTestById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Test Categories
      .addCase(fetchTestCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.testCategories = action.payload;
      })
      .addCase(fetchTestCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentTest, clearError } = testSlice.actions;
export default testSlice.reducer;
