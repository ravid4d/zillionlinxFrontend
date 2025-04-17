import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const categoryUrl = `${process.env.REACT_APP_API_URL}/api/categories`;

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(categoryUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message ||  "Failed to fetch categories"
      });
    }
  }
);

export const fetchSubCategories = createAsyncThunk(
  "categories/fetchSubCategories",
  async ({ selectedCategoryId, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${categoryUrl}?parent_id=${selectedCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const subcategories = response?.data?.data || []; 
      return subcategories;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message ||  "Failed to fetch subcategories"
      });
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    subCategories: [],
    status: "",
    categories: [],
    loading: {},
    subloading: false,
    error: {},
  },
  reducers: {
    resetSubCategories: (state) => {
      state.subCategories = []; // ✅ Reset subcategories when category changes
    },
  },
  extraReducers: (builder) => {
  
      //Fetch Categories
      builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading.fetchCategories = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading.fetchCategories = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading.fetchCategories = false;
        state.error.fetchCategories = action.payload.message;
        state.status = action.payload.status;
      })
    
      //Fetch Sub Categories
      builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading.fetchSubCategories = true;
        state.error.fetchSubCategories = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading.fetchSubCategories = false;
        state.subCategories = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading.fetchSubCategories = false;
        state.error.fetchSubCategories = action.payload.message;
        state.status = action.payload.status;
      });
  }
});
export const { resetSubCategories } = categorySlice.actions;
export default categorySlice.reducer;
