import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Async thunks
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { msg: "Registration failed" });
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);
      // Store token in localStorage for header-based auth
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { msg: "Login failed" });
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
      // Clear token from localStorage
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || { msg: "Logout failed" });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
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
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "Registration failed";
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || "Login failed";
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem("user");
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = action.payload?.msg || "Logout failed";
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
