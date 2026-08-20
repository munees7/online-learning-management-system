import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import courseReducer from "./slices/courseSlice";
import enrollReducer from "./slices/enrollSlice";
import wishlistReducer from "./slices/wishlistSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    enroll: enrollReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
});
