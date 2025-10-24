import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";
import { toast } from "react-toastify";

// Thunks
export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const res = await userService.getAllUsers(filters);
      return res.data.data; // Directly return the array from data.data
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to load users"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await userService.createUser(payload);
      toast.success(res.data.message || "User created successfully");
      return res.data.data; // Return the created user object
    } catch (err) {
      console.log("err", err);
      const errorMsg = err?.response?.data?.errors || "Failed to create user";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await userService.updateUser(id, data);
      toast.success(res.data.message || "User updated successfully");
      return res.data.data; // Return the updated user object
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Failed to update user";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

export const toggleUserStatusThunk = createAsyncThunk(
  "users/toggleUserStatus",
  async ({ id, makeActive }, { rejectWithValue }) => {
    try {
      const res = makeActive
        ? await userService.activateUser(id)
        : await userService.deactivateUser(id);
      const action = makeActive ? "activated" : "deactivated";
      toast.success(`User ${action} successfully`);
      return res.data.data; // Return the updated user object
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Failed to update status";
      toast.error(errorMsg);
      return rejectWithValue(errorMsg);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
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
      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload); // Add new user to beginning
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Status
      .addCase(toggleUserStatusThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(toggleUserStatusThunk.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(toggleUserStatusThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
