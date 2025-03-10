import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import { persistReducer } from "redux-persist";
import bookmarkReducer from "./slices/bookmarkSlice";
import authReducer from "./slices/authSlice";
import registerReducer from "./slices/registerSlice";
import categoryReducer from "./slices/categorySlice";
import userReducer from "./slices/userSlice";

// Define persist configuration for the auth reducer
const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["token", "userRole", "isLoggedIn"], // Persist only these fields
};

// Define the root reducer
const rootReducer = combineReducers({
    bookmark: bookmarkReducer,
    auth: persistReducer(authPersistConfig, authReducer), // Persisted auth reducer
    register: registerReducer,
    category: categoryReducer,
    user: userReducer,
});

export default rootReducer;
