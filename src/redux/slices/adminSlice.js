import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const categoryUrl = `${process.env.REACT_APP_API_URL}/api/admin/categories`;

export const getParentCategories = createAsyncThunk(
  "admin/getParentCategories",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(categoryUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      let parentCategories = response?.data?.data?.filter(
        (category) => category?.parent_id === null
      );
      return parentCategories;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Login failed"
      });
    }
  }
);

export const addNewCategory = createAsyncThunk(
  "admin/addNewCategory",
  async ({ values, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        categoryUrl,
        {
          title: values?.title,
          parent_id: values?.parent_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response?.data?.message;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Login failed"
      });
    }
  }
);

export const getAdminCategory = createAsyncThunk(
  "admin/getAdminCategory",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(categoryUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      let allCategories = response?.data?.data?.filter((category) => category);
      return allCategories;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Login failed"
      });
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    status: "",
    loading: false,
    error: null,
    parentCategories: [],
    adminCategories:[]
  },
  reducers: {},
  extraReducers: (builder) => {
    //Fetch Top Links
    builder
      .addCase(getParentCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getParentCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.parentCategories = action.payload;
      })
      .addCase(getParentCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
    builder
      .addCase(addNewCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewCategory.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addNewCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });

    builder
      .addCase(getAdminCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.adminCategories = action.payload
      })
      .addCase(getAdminCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  }
});

export default adminSlice.reducer;
