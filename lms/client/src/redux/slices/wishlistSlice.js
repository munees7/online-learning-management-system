import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../services/api";

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
  try { const res = await api.getWishlist(); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const toggleWishlistItem = createAsyncThunk("wishlist/toggle", async (courseId, { rejectWithValue }) => {
  try { const res = await api.toggleWishlist(courseId); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.items = action.payload.wishlist; })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        // Refetch handled by component
      });
  },
});

export default wishlistSlice.reducer;
