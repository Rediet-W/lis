import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import testOrderService from "../../services/testOrderService";
const ensureArray = (v) =>
  Array.isArray(v) ? v : v?.data && Array.isArray(v.data) ? v.data : [];

export const fetchTestOrders = createAsyncThunk(
  "testOrders/fetchTestOrders",
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testOrderService.getAllTestOrders(
        filters,
        auth.token
      );
      console.log("Fetched Test Orders:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch test orders:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch test orders"
      );
    }
  }
);

export const fetchTestOrderById = createAsyncThunk(
  "testOrders/fetchTestOrderById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testOrderService.getTestOrderById(id, auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch test order"
      );
    }
  }
);

export const createTestOrder = createAsyncThunk(
  "testOrders/createTestOrder",
  async (orderData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testOrderService.createTestOrder(
        orderData,
        auth.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create test order"
      );
    }
  }
);

export const updateTestOrderStatus = createAsyncThunk(
  "testOrders/updateTestOrderStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testOrderService.updateTestOrderStatus(
        id,
        status,
        auth.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update test order status"
      );
    }
  }
);

export const fetchPendingTestOrders = createAsyncThunk(
  "testOrders/fetchPendingTestOrders",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testOrderService.getPendingTestOrders(auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending test orders"
      );
    }
  }
);

export const fetchTestOrderResults = createAsyncThunk(
  "testOrders/fetchTestOrderResults",
  async (testOrderId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await testOrderService.getTestOrderResults(
        testOrderId,
        auth.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch test order results"
      );
    }
  }
);

const testOrderSlice = createSlice({
  name: "testOrders",
  initialState: {
    testOrders: [],
    pendingTestOrders: [],
    currentTestOrder: null,
    testOrderResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentTestOrder: (state) => {
      state.currentTestOrder = null;
    },
    clearTestOrderResults: (state) => {
      state.testOrderResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Test Orders
      .addCase(fetchTestOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestOrders.fulfilled, (s, a) => {
        s.loading = false;
        s.testOrders = ensureArray(a.payload);
      })
      .addCase(fetchTestOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Test Order by ID
      .addCase(fetchTestOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTestOrder = action.payload;
      })
      .addCase(fetchTestOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Test Order
      .addCase(createTestOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTestOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.testOrders.push(action.payload);
      })
      .addCase(createTestOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Test Order Status
      .addCase(updateTestOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTestOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.testOrders.findIndex(
          (to) => to.id === action.payload.id
        );
        if (index !== -1) {
          state.testOrders[index] = {
            ...state.testOrders[index],
            ...action.payload,
          };
        }
        if (
          state.currentTestOrder &&
          state.currentTestOrder.id === action.payload.id
        ) {
          state.currentTestOrder = {
            ...state.currentTestOrder,
            ...action.payload,
          };
        }
      })
      .addCase(updateTestOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Pending Test Orders
      .addCase(fetchPendingTestOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingTestOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingTestOrders = action.payload;
      })
      .addCase(fetchPendingTestOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Test Order Results
      .addCase(fetchTestOrderResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTestOrderResults.fulfilled, (state, action) => {
        state.loading = false;
        state.testOrderResults = action.payload;
      })
      .addCase(fetchTestOrderResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentTestOrder, clearTestOrderResults, clearError } =
  testOrderSlice.actions;
export default testOrderSlice.reducer;
