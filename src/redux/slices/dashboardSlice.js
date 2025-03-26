import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const dashboardUrl = `${process.env.REACT_APP_API_URL}/api/admin/dashboard`;
const sixmonthUSerCountUrl = `${process.env.REACT_APP_API_URL}/api/admin/six-months-user`;
const sixmonthBookmarkCountUrl = `${process.env.REACT_APP_API_URL}/api/admin/six-months-bookmark`;

// Async thunk to fetch dashboard data
export const getDashboardData = createAsyncThunk(
  "admin/getDashboardData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");

      if (!token) {
        return rejectWithValue({ status: 401, message: "Unauthorized: No token found" });
      }

      const response = await axiosInstance.post(
        dashboardUrl,
        {}, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
   
      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status || 500,
        message: error?.response?.data?.message || "Failed to fetch dashboard data",
      });
    }
  }
);

export const getSixMonthUserCount = createAsyncThunk(
  "admin/getSixMonthUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");

      if (!token) {
        return rejectWithValue({ status: 401, message: "Unauthorized: No token found" });
      }

      const response = await axiosInstance.post(
        sixmonthUSerCountUrl,
        {}, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  // console.log(response.data.six_months_user) ;
      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status || 500,
        message: error?.response?.data?.message || "Failed to fetch dashboard data",
      });
    }
  }
);

export const getSixMonthBookmarkCount = createAsyncThunk(
  "admin/getSixMonthBookmark",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem("token");

      if (!token) {
        return rejectWithValue({ status: 401, message: "Unauthorized: No token found" });
      }

      const response = await axiosInstance.post(
        sixmonthBookmarkCountUrl,
        {}, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  // console.log(response.data.six_months_user) ;
      return response.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status || 500,
        message: error?.response?.data?.message || "Failed to fetch dashboard data",
      });
    }
  }
);

// Redux slice
const dashboardSlice = createSlice({
  name: "admin",
  initialState: {
    dashboardData: null,
    sixMonthUserCount: null,
    sixMonthBookmarkCount: null,
    loading: false,
    error: null,
    status: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
        state.status = "success";
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occurred";
        state.status = action.payload?.status || 500;
      })
      .addCase(getSixMonthUserCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSixMonthUserCount.fulfilled, (state, action) => {
        state.loading = false;
        state.sixMonthUserCount = action.payload;
        state.status = "success";
      })
      .addCase(getSixMonthUserCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occurred";
        state.status = action.payload?.status || 500;
      })
      .addCase(getSixMonthBookmarkCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSixMonthBookmarkCount.fulfilled, (state, action) => {
        state.loading = false;
        state.sixMonthBookmarkCount = action.payload;
        state.status = "success";
      })
      .addCase(getSixMonthBookmarkCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "An error occurred";
        state.status = action.payload?.status || 500;
      });
  },
});

export default dashboardSlice.reducer;
