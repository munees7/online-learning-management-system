import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../services/api";

export const register = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
  try {
    const res = await api.registerUser(data);
    localStorage.setItem("lms_token", res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Registration failed");
  }
});

export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await api.loginUser(data);
    localStorage.setItem("lms_token", res.data.token);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const loadUser = createAsyncThunk("auth/loadUser", async (_, { rejectWithValue }) => {
  try {
    const res = await api.getMe();
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateUserProfile = createAsyncThunk("auth/updateProfile", async (data, { rejectWithValue }) => {
  try {
    const res = await api.updateProfile(data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: localStorage.getItem("lms_token"), loading: false, error: null },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("lms_token");
      state.user = null;
      state.token = null;
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(register.rejected, rejected)
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(login.rejected, rejected)
      .addCase(loadUser.pending, pending)
      .addCase(loadUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; })
      .addCase(loadUser.rejected, (state) => { state.loading = false; state.user = null; state.token = null; localStorage.removeItem("lms_token"); })
      .addCase(updateUserProfile.fulfilled, (state, action) => { state.user = action.payload.user; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
