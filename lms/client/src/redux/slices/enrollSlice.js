import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../services/api";

export const fetchEnrollments = createAsyncThunk("enroll/fetchAll", async (_, { rejectWithValue }) => {
  try { const res = await api.getEnrollments(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const enrollInCourse = createAsyncThunk("enroll/enroll", async (courseId, { rejectWithValue }) => {
  try { const res = await api.enrollCourse(courseId); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const markProgress = createAsyncThunk("enroll/progress", async (data, { rejectWithValue }) => {
  try { const res = await api.updateProgress(data); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const enrollSlice = createSlice({
  name: "enroll",
  initialState: { enrollments: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrollments.pending, (state) => { state.loading = true; })
      .addCase(fetchEnrollments.fulfilled, (state, action) => { state.loading = false; state.enrollments = action.payload.enrollments; })
      .addCase(fetchEnrollments.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        if (action.payload.enrollment) state.enrollments.push(action.payload.enrollment);
      })
      .addCase(markProgress.fulfilled, (state, action) => {
        const idx = state.enrollments.findIndex(e => e._id === action.payload.enrollment._id);
        if (idx !== -1) state.enrollments[idx] = action.payload.enrollment;
      });
  },
});

export default enrollSlice.reducer;
