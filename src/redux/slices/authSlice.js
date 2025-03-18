import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";
const loginUrl = `${process.env.REACT_APP_API_URL}/api/login`;
const loginAdminUrl = `${process.env.REACT_APP_API_URL}/api/admin/login`;

export const handleLogin = createAsyncThunk(
  "auth/login",
  async ({ values, navigate, loginType }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        loginType === "admin" ? loginAdminUrl : loginUrl,
        {
          type: "email",
          email: values?.email,
          password: values?.password
        }
      );
      let token = response?.data?.data?.token || null;
      let userRole = response?.data?.data?.user?.role || undefined;
      let message = response?.data?.message || "";
      let isLoggedIn =
        response?.data?.data?.token !== undefined ||
        response?.data?.data?.token !== null
          ? !!response?.data?.data?.token
          : false;
      if (token !== undefined) {
        let navigateTo = loginType === "user" ? "bookmarks" : "admin";
        navigate(`/${navigateTo}`);
      }
      return { token, message, userRole, isLoggedIn };
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
    status:"",
    isLoggedIn: false,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userRole = null;
      state.isLoggedIn = false;
      localStorage.removeItem("persist:auth"); 
    }
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
      })
      .addCase(handleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
