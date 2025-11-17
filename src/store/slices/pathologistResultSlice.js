import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import pathologistReportService from "../../services/pathologistReportService";

const ensureArray = (v) =>
  Array.isArray(v) ? v : v?.data && Array.isArray(v.data) ? v.data : [];

export const fetchPathologistReports = createAsyncThunk(
  "pathologistReports/fetchAll",
  async (filters = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await pathologistReportService.getAll(filters, auth.token);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch reports"
      );
    }
  }
);

export const fetchPathologistReportById = createAsyncThunk(
  "pathologistReports/fetchById",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await pathologistReportService.getById(id, auth.token);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch report"
      );
    }
  }
);

export const createPathologistReport = createAsyncThunk(
  "pathologistReports/create",
  async (payload, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await pathologistReportService.create(payload, auth.token);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create report"
      );
    }
  }
);

export const updatePathologistReport = createAsyncThunk(
  "pathologistReports/update",
  async ({ id, data }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await pathologistReportService.update(id, data, auth.token);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update report"
      );
    }
  }
);

export const deletePathologistReport = createAsyncThunk(
  "pathologistReports/delete",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const res = await pathologistReportService.remove(id, auth.token);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete report"
      );
    }
  }
);

const slice = createSlice({
  name: "pathologistReports",
  initialState: {
    reports: [],
    currentReport: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentReport(state) {
      state.currentReport = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(fetchPathologistReports.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchPathologistReports.fulfilled, (s, a) => {
        s.loading = false;
        s.reports = ensureArray(a.payload);
      })
      .addCase(fetchPathologistReports.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(fetchPathologistReportById.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchPathologistReportById.fulfilled, (s, a) => {
        s.loading = false;
        s.currentReport = a.payload;
      })
      .addCase(fetchPathologistReportById.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(createPathologistReport.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(createPathologistReport.fulfilled, (s, a) => {
        s.loading = false;
        s.reports.unshift(a.payload);
      })
      .addCase(createPathologistReport.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(updatePathologistReport.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updatePathologistReport.fulfilled, (s, a) => {
        s.loading = false;
        const idx = s.reports.findIndex((r) => r.id === a.payload.id);
        if (idx !== -1) s.reports[idx] = a.payload;
        if (s.currentReport?.id === a.payload.id) s.currentReport = a.payload;
      })
      .addCase(updatePathologistReport.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(deletePathologistReport.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(deletePathologistReport.fulfilled, (s, a) => {
        s.loading = false;
        s.reports = s.reports.filter(
          (r) => r.id !== (a.payload?.id ?? a.meta.arg)
        );
      })
      .addCase(deletePathologistReport.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      }),
});

export const { clearCurrentReport, clearError } = slice.actions;
export default slice.reducer;
