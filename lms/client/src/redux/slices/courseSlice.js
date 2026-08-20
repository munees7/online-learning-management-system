import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../services/api";

export const fetchCourses = createAsyncThunk("courses/fetchAll", async (params, { rejectWithValue }) => {
  try { const res = await api.getCourses(params); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchFeatured = createAsyncThunk("courses/featured", async (_, { rejectWithValue }) => {
  try { const res = await api.getFeaturedCourses(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchCourse = createAsyncThunk("courses/fetchOne", async (id, { rejectWithValue }) => {
  try { const res = await api.getCourse(id); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchInstructorCourses = createAsyncThunk("courses/instructor", async (_, { rejectWithValue }) => {
  try { const res = await api.getInstructorCourses(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [], featured: [], current: null, instructorCourses: [],
    total: 0, pages: 1, loading: false, error: null,
  },
  reducers: { clearCurrent: (state) => { state.current = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.loading = true; })
      .addCase(fetchCourses.fulfilled, (state, action) => { state.loading = false; state.courses = action.payload.courses; state.total = action.payload.total; state.pages = action.payload.pages; })
      .addCase(fetchCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.featured = action.payload.courses; })
      .addCase(fetchCourse.pending, (state) => { state.loading = true; })
      .addCase(fetchCourse.fulfilled, (state, action) => { state.loading = false; state.current = action.payload; })
      .addCase(fetchCourse.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchInstructorCourses.fulfilled, (state, action) => { state.instructorCourses = action.payload.courses; });
  },
});

export const { clearCurrent } = courseSlice.actions;
export default courseSlice.reducer;
