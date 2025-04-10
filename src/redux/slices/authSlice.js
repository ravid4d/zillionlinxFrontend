import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";
import { setUser } from "./userSlice";
const loginUrl = `${process.env.REACT_APP_API_URL}/api/login`;
const loginAdminUrl = `${process.env.REACT_APP_API_URL}/api/admin/login`;

export const handleLogin = createAsyncThunk(
  "auth/login",
  async ({ values, loginType }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        loginType === "admin" ? loginAdminUrl : loginUrl,
        {
          type: "email",
          email: values?.email,
          password: values?.password,
          remember_me: values?.remember_me || false,
        }
      );
      const data = response?.data?.data;
      const user = data?.user || null;
      const token = data?.token || null;
      const userRole = user?.role || undefined;
      const message = response?.data?.message || "";
      const isLoggedIn = !!token;
      
      dispatch(setUser(user));
      return { token, message, userRole, isLoggedIn, user };

    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Login failed",
      });
    }
  }
);

export const handleGoogleLogin = createAsyncThunk(
  "auth/googleLogin",
  async ({ accessToken }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(loginUrl, {
        type: "google",
        google_token: accessToken,
      });

      const data = response?.data?.data;
      const token = data?.token || null;
      const user = data?.user || null;
      const userRole = user?.role || undefined;
      const message = response?.data?.message || "";
      const isLoggedIn = !!token;

      dispatch(setUser(user));
      return { token, message, userRole, isLoggedIn, user };

    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Login failed",
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userRole: null,
    status: "",
    isLoggedIn: false,
    loading: false,
    error: null,
    user: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userRole = null;
      state.isLoggedIn = false;
      state.user = null;
      localStorage.clear();
      // localStorage.removeItem("persist:auth");
    },
  },
  extraReducers: (builder) => {
    //Fetch Top Links
    builder
      .addCase(handleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = action.payload.isLoggedIn;
        state.userRole = action.payload.userRole;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });

    builder
      .addCase(handleGoogleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleGoogleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = action.payload.isLoggedIn;
        state.userRole = action.payload.userRole;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(handleGoogleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
