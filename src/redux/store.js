import { configureStore } from "@reduxjs/toolkit";
import bookmarkReducer from "./slices/bookmarkSlice";
import authReducer from "./slices/authSlice";
import registerReducer from "./slices/registerSlice";
import categoryReducer from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    bookmark: bookmarkReducer,
    auth: authReducer,
    register:registerReducer,
    category:categoryReducer,
  },
});
