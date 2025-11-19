import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import testService from "../../services/testService";
import { toast } from "react-toastify";

// Thunks for Tests
export const fetchTests = createAsyncThunk(
  "tests/fetchTests",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await testService.getAllTests(filters);
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch tests";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const fetchTestById = createAsyncThunk(
  "tests/fetchTestById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await testService.getTestById(id);
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to fetch test";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const createTest = createAsyncThunk(
  "tests/createTest",
  async (testData, { rejectWithValue }) => {
    try {
      const response = await testService.createTest(testData);
      toast.success(response.data.message || "Test created successfully");
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to create test";
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

export const updateTest = createAsyncThunk(
  "tests/updateTest",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await testService.updateTest(id, data);
      toast.success(response.data.message || "Test updated successfully");
      return response.data.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update test";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteTest = createAsyncThunk(
  "tests/deleteTest",
  async (id, { rejectWithValue }) => {
    try {
      const response = await testService.deleteTest(id);
      toast.success(response.data.message || "Test deleted successfully");
      return id;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to delete test";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

// Thunks for Categories
export const fetchTestCategories = createAsyncThunk(
  "tests/fetchTestCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await testService.getTestCategories();
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch categories";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const createCategory = createAsyncThunk(
  "tests/createCategory",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await testService.createCategory(categoryData);
      toast.success(response.data.message || "Category created successfully");
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to create category";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "tests/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await testService.updateCategory(id, data);
      toast.success(response.data.message || "Category updated successfully");
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update category";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "tests/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await testService.deleteCategory(id);
      toast.success(response.data.message || "Category deleted successfully");
      return id;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete category";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);
// Thunks for Sample Types
export const fetchSampleTypes = createAsyncThunk(
  "tests/fetchSampleTypes",
  async (activeOnly = true, { rejectWithValue }) => {
    try {
      const response = await testService.getAllSampleTypes(activeOnly);

      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to fetch sample types";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const createSampleType = createAsyncThunk(
  "tests/createSampleType",
  async (sampleTypeData, { rejectWithValue }) => {
    try {
      const response = await testService.createSampleType(sampleTypeData);
      toast.success(
        response.data.message || "Sample type created successfully"
      );
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to create sample type";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateSampleType = createAsyncThunk(
  "tests/updateSampleType",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await testService.updateSampleType(id, data);
      toast.success(
        response.data.message || "Sample type updated successfully"
      );
      return response.data.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to update sample type";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const deleteSampleType = createAsyncThunk(
  "tests/deleteSampleType",
  async (id, { rejectWithValue }) => {
    try {
      const response = await testService.deleteSampleType(id);
      toast.success(
        response.data.message || "Sample type deleted successfully"
      );
      return id;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to delete sample type";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
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
      // Create Test
      .addCase(createTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTest.fulfilled, (state, action) => {
        state.loading = false;
        state.tests.unshift(action.payload);
      })
      .addCase(createTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Test
      .addCase(updateTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTest.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tests.findIndex(
          (test) => test.id === action.payload.id
        );
        if (index !== -1) {
          state.tests[index] = action.payload;
        }
        if (state.currentTest && state.currentTest.id === action.payload.id) {
          state.currentTest = action.payload;
        }
      })
      .addCase(updateTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Test
      .addCase(deleteTest.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTest.fulfilled, (state, action) => {
        state.loading = false;
        state.tests = state.tests.filter((test) => test.id !== action.payload);
      })
      .addCase(deleteTest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Categories
      .addCase(fetchTestCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.testCategories = action.payload;
      })
      .addCase(fetchTestCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.testCategories.push(action.payload);
      })
      // Update Category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.testCategories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.testCategories[index] = action.payload;
        }
        // Also update category name in tests
        state.tests = state.tests.map((test) =>
          test.category_id === action.payload.id
            ? { ...test, category_name: action.payload.name }
            : test
        );
      })
      // Delete Category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.testCategories = state.testCategories.filter(
          (cat) => cat.id !== action.payload
        );
      })
      // Fetch Sample Types
      .addCase(fetchSampleTypes.fulfilled, (state, action) => {
        state.sampleTypes = action.payload;
      })
      // Create Sample Type
      .addCase(createSampleType.fulfilled, (state, action) => {
        state.sampleTypes.push(action.payload);
      })
      // Update Sample Type
      .addCase(updateSampleType.fulfilled, (state, action) => {
        const index = state.sampleTypes.findIndex(
          (st) => st.id === action.payload.id
        );
        if (index !== -1) {
          state.sampleTypes[index] = action.payload;
        }
      })
      // Delete Sample Type
      .addCase(deleteSampleType.fulfilled, (state, action) => {
        state.sampleTypes = state.sampleTypes.filter(
          (st) => st.id !== action.payload
        );
      });
  },
});

export const { clearCurrentTest, clearError } = testSlice.actions;
export default testSlice.reducer;
