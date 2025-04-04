import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import bookmarkReducer from "./slices/bookmarkSlice";
import authReducer from "./slices/authSlice";
import registerReducer from "./slices/registerSlice";
import categoryReducer from "./slices/categorySlice";
import userReducer from "./slices/userSlice";
import adminReducer from "./slices/adminSlice";
import dashboardReducer from "./slices/dashboardSlice";
import storageSession from "redux-persist/lib/storage/session";
// Define persist configuration for the auth reducer
const authPersistConfig = {
    key: "auth",
    storage: storageSession,
    whitelist: ["token", "userRole", "isLoggedIn"], // Persist only these fields
};

const userPersistConfig = {
    key: "user",
    storage: storageSession, 
    whitelist: ["user"], // ✅ Persist user details separately
};

// Define the root reducer
const rootReducer = combineReducers({
    bookmark: bookmarkReducer,
    auth: persistReducer(authPersistConfig, authReducer), // Persisted auth reducer
    user: persistReducer(userPersistConfig, userReducer),
    register: registerReducer,
    category: categoryReducer,
    admin: adminReducer,
    dashboard: dashboardReducer
});

export default rootReducer;
