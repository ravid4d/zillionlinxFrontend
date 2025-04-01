import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";
const allUsersUrl = `${process.env.REACT_APP_API_URL}/api/admin/users`;
const updateUserUrl = `${process.env.REACT_APP_API_URL}/api/admin/user/update/`;
const updateFrontUserUrl = `${process.env.REACT_APP_API_URL}/api/user/update/`;
const updateUserPasswordUrl = `${process.env.REACT_APP_API_URL}/api/change-password`;

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (_, { getState, rejectWithValue }) => {
    try {
      let token = getState().auth.token;
      let searchQuery = getState().admin?.searchQuery;
      
      let response = await axiosInstance.get(`${allUsersUrl}?search=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
   
      return response?.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message:
          error?.response?.data?.message || "Error While getting all the users."
      });
    }
  }
);

export const handleUsersPagination = createAsyncThunk(
  "users/pagination",
  async ({ url, token }, { rejectWithValue }) => {
    try {
      let response = await axiosInstance.get(url, {
        headers: {  
          Authorization: `Bearer ${token}`
        }
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message:
          error?.response?.data?.message ||
          "Error While getting the users via pagination."
      });
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async({token, values, userId}, {rejectWithValue})=>{
    try {
      let response = await axiosInstance.post(`${updateUserUrl}${userId}`,
      {
        first_name: values?.first_name,
        last_name: values?.last_name,
        email: values?.email,
        country: values?.country,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response?.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message:
          error?.response?.data?.message ||
          "Error While getting the users via pagination."
      });
    }
  }
);

export const updateFrontUser = createAsyncThunk(
  "users/updateFrontUser",
  async({token, values, userId}, {rejectWithValue})=>{
    try {
      let response = await axiosInstance.post(`${updateFrontUserUrl}${userId}`,
      {
        first_name: values?.first_name,
        last_name: values?.last_name,
        email: values?.email,
        country: values?.country,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response, 'ddff')
      return response?.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message:
          error?.response?.data?.message ||
          "Error While getting the users via pagination."
      });
    }
  }
);

export const updateUserPassword = createAsyncThunk(
  "users/updateUserPassword",
  async({token, values}, {rejectWithValue})=>{
    try {
      let response = await axiosInstance.post(`${updateUserPasswordUrl}`, 
        {
          current_password:values.currentPassword,
          new_password:values.newPassword,
          new_password_confirmation:values.confirmPassword
        }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("Password update response:", response);
      return response?.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Error updating password.";
      return rejectWithValue({
        status: error?.response?.status || 500,
        message: errorMessage,
      });
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    status: "",
    totalUsers: undefined,
    user: {},
    pagination: [],
    userLoading: false,
    userError: null
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state, action) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.userLoading = false;
        state.users = action.payload.data?.data;
        state.totalUsers = action.payload.data?.total;
        state.pagination = action.payload.data?.links;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
    builder
      .addCase(handleUsersPagination.pending, (state, action) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(handleUsersPagination.fulfilled, (state, action) => {
        state.userLoading = false;
        state.users = action.payload.data?.data;
        state.totalUsers = action.payload.data?.total;
        state.pagination = action.payload.data?.links;
      })
      .addCase(handleUsersPagination.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
    builder
      .addCase(updateUser.pending, (state, action) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userLoading = false;
        // state.users = action.payload.data?.data;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });

    builder
      .addCase(updateUserPassword.pending, (state, action) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.userLoading = false;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  }
});

// export const { } = userSlice.actions;
export default userSlice.reducer;
