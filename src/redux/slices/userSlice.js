import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";
const allUsersUrl = `${process.env.REACT_APP_API_URL}/api/admin/users`;
const updateUserUrl = `${process.env.REACT_APP_API_URL}/api/admin/user/update/`;
const updateFrontUserUrl = `${process.env.REACT_APP_API_URL}/api/user/update/`;
const updateAdminPasswordUrl = `${process.env.REACT_APP_API_URL}/api/admin/change-password`;
const updateAdminImageUrl = `${process.env.REACT_APP_API_URL}/api/admin/profile/image`;
const updateUserPasswordUrl = `${process.env.REACT_APP_API_URL}/api/change-password`;

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (filterBy, { getState, rejectWithValue }) => {
    try {
      let token = getState().auth.token;
      let searchQuery = getState().admin?.searchQuery;

      let response = await axiosInstance.get(
        allUsersUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            search: searchQuery,
            sort_by: filterBy?.sort_by,
            sort_order: filterBy?.sort_order,
          },
        },
      );

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
  async ({ token, values, userId }, { rejectWithValue }) => {
    try {
      let response = await axiosInstance.post(
        `${updateUserUrl}${userId}`,
        {
          first_name: values?.first_name,
          last_name: values?.last_name,
          email: values?.email,
          country: values?.country
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

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

export const updateAdminImage = createAsyncThunk(
  "users/updateAdminImage",
  async (formData, { getState, rejectWithValue }) => {
    console.log(formData, 'values');
    try {
      let token = getState().auth.token;
      for (let [key, val] of formData.entries()) {
        console.log(key, val); // should log profile_image and the File
      }
      let response = await axiosInstance.post(
        `${updateAdminImageUrl}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          }
        }
      );

      return response?.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message:
          error?.response?.data?.message ||
          "Error While updating the admin image."
      });
    }
  }
);

export const updateFrontUser = createAsyncThunk(
  "users/updateFrontUser",
  async ({ token, values, userId }, { rejectWithValue }) => {
    try {
      console.log(values?.country, 'values?.country')
      // console.log(token, values, userId, "data are");
      let response = await axiosInstance.post(
        `${updateFrontUserUrl}${userId}`,
        {
          first_name: values?.first_name,
          last_name: values?.last_name,
          email: values?.email,
          country: values?.country
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
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
  async ({ token, values }, { rejectWithValue }) => {
    try {
      let response = await axiosInstance.post(
        `${updateUserPasswordUrl}`,
        {
          current_password: values.currentPassword,
          new_password: values.newPassword,
          new_password_confirmation: values.confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // console.log("Password update response:", response);
      return response?.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Error updating password.";
      return rejectWithValue({
        status: error?.response?.status || 500,
        message: errorMessage
      });
    }
  }
);

export const updateAdminPassword = createAsyncThunk(
  "users/updateAdminPassword",
  async ({ token, values }, { rejectWithValue }) => {
    try {
      let response = await axiosInstance.post(
        `${updateAdminPasswordUrl}`,
        {
          current_password: values.currentPassword,
          new_password: values.newPassword,
          new_password_confirmation: values.confirmPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // console.log("Password update response:", response);
      return response?.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Error updating password.";
      return rejectWithValue({
        status: error?.response?.status || 500,
        message: errorMessage
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
    loading: {},
    error: {},
    userLoading: false,
    userError: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    updateProfileImage: (state, action) => {
      if (state.user) {
        state.user.profile_image = action.payload;
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state, action) => {
        state.loading.getAllUsers = true;
        state.error.getAllUsers = null;
        // state.userLoading = true;
        // state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        // state.userLoading = false;
        state.loading.getAllUsers = false;
        state.users = action.payload.data?.data;
        state.totalUsers = action.payload.data?.total;
        state.pagination = action.payload.data?.links;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        // state.userLoading = false;
        state.loading.getAllUsers = false;
        state.error.getAllUsers = action.payload.message;
        state.status = action.payload.status;
      });

    builder
      .addCase(handleUsersPagination.pending, (state, action) => {
        state.loading.getAllUsers = true;
        state.error.getAllUsers = null;
        // state.userLoading = true;
        // state.error = null;
      })
      .addCase(handleUsersPagination.fulfilled, (state, action) => {
        // state.userLoading = false;
        state.loading.getAllUsers = false;
        state.users = action.payload.data?.data;
        state.totalUsers = action.payload.data?.total;
        state.pagination = action.payload.data?.links;
      })
      .addCase(handleUsersPagination.rejected, (state, action) => {
        // state.userLoading = false;
        state.loading.getAllUsers = false;
        state.error.getAllUsers = action.payload.message;
        state.status = action.payload.status;
      });

    builder
      .addCase(updateUser.pending, (state, action) => {
        state.loading.updateUser = true;
        state.error.updateUser = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading.updateUser = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading.updateUser = false;
        state.error.updateUser = action.payload.message;
        state.status = action.payload.status;
      });

    builder
      .addCase(updateFrontUser.pending, (state, action) => {
        state.loading.updateFrontUser = true;
        state.error.updateFrontUser = null;
      })
      .addCase(updateFrontUser.fulfilled, (state, action) => {
        state.loading.updateFrontUser = false;
        state.user = action.payload.user;
      })
      .addCase(updateFrontUser.rejected, (state, action) => {
        state.loading.updateFrontUser = false;
        state.error.updateFrontUser = action.payload.message;
        state.status = action.payload.status;
      });

    builder
      .addCase(updateUserPassword.pending, (state, action) => {
        state.loading.updateUserPassword = true;
        state.error.updateUserPassword = null;
      })
      .addCase(updateUserPassword.fulfilled, (state, action) => {
        state.loading.updateUserPassword = false;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading.updateUserPassword = false;
        state.error.updateUserPassword = action.payload.message;
        state.status = action.payload.status;
      });

    builder
      .addCase(updateAdminPassword.pending, (state, action) => {
        state.loading.updateAdminPassword = true;
        state.error.updateAdminPassword = null;
      })
      .addCase(updateAdminPassword.fulfilled, (state, action) => {
        state.loading.updateAdminPassword = false;
      })
      .addCase(updateAdminPassword.rejected, (state, action) => {
        state.loading.updateAdminPassword = false;
        state.error.updateAdminPassword = action.payload.message;
        state.status = action.payload.status;
      });
  }
});

export const { setUser, clearUser, updateUserCountry, updateProfileImage } = userSlice.actions;
export default userSlice.reducer;
