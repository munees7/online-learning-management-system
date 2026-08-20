import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    darkMode: localStorage.getItem("lms_dark") === "true",
    sidebarOpen: true,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem("lms_dark", state.darkMode);
    },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
  },
});

export const { toggleDarkMode, toggleSidebar } = uiSlice.actions;
export default uiSlice.reducer;
