import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import visitService from "../../services/visitService";

export const fetchVisits = createAsyncThunk(
  "visits/fetchVisits",
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await visitService.getAllVisits(filters, auth.token);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch visits"
      );
    }
  }
);

export const fetchVisitById = createAsyncThunk(
  "visits/fetchVisitById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await visitService.getVisitById(id, auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch visit"
      );
    }
  }
);

export const createVisit = createAsyncThunk(
  "visits/createVisit",
  async (visitData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await visitService.createVisit(visitData, auth.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create visit"
      );
    }
  }
);

export const updateVisitStatus = createAsyncThunk(
  "visits/updateVisitStatus",
  async ({ id, status }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await visitService.updateVisitStatus(
        id,
        status,
        auth.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update visit status"
      );
    }
  }
);

export const fetchVisitTestOrders = createAsyncThunk(
  "visits/fetchVisitTestOrders",
  async (visitId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await visitService.getVisitTestOrders(
        visitId,
        auth.token
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch visit test orders"
      );
    }
  }
);

const visitSlice = createSlice({
  name: "visits",
  initialState: {
    visits: [],
    currentVisit: null,
    visitTestOrders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentVisit: (state) => {
      state.currentVisit = null;
    },
    clearVisitTestOrders: (state) => {
      state.visitTestOrders = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Visits
      .addCase(fetchVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisits.fulfilled, (state, action) => {
        state.loading = false;
        state.visits = action.payload;
      })
      .addCase(fetchVisits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Visit by ID
      .addCase(fetchVisitById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentVisit = action.payload;
      })
      .addCase(fetchVisitById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Visit
      .addCase(createVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVisit.fulfilled, (state, action) => {
        state.loading = false;
        state.visits.push(action.payload);
      })
      .addCase(createVisit.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Visit Status
      .addCase(updateVisitStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVisitStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.visits.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.visits[index] = { ...state.visits[index], ...action.payload };
        }
        if (state.currentVisit && state.currentVisit.id === action.payload.id) {
          state.currentVisit = { ...state.currentVisit, ...action.payload };
        }
      })
      .addCase(updateVisitStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Visit Test Orders
      .addCase(fetchVisitTestOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVisitTestOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.visitTestOrders = action.payload;
      })
      .addCase(fetchVisitTestOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentVisit, clearVisitTestOrders, clearError } =
  visitSlice.actions;
export default visitSlice.reducer;
