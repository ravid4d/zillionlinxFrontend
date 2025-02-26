import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const categoryUrl = `${process.env.REACT_APP_API_URL}/api/categories`;

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(categoryUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch categories");
    }
  }
);

export const fetchSubCategories = createAsyncThunk(
  "categories/fetchSubCategories",
  async ({ selectedCategoryId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${categoryUrl}?parent_id=${selectedCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data?.data; 
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch subcategories");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState: {
    subCategories: [],
    categories: [],
    loading: false,
    subloading: false,
    error: null,
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
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
    
      //Fetch Sub Categories
      builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.subloading = true;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.subloading = false;
        state.subCategories = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.subloading = false;
        state.error = action.payload;
      });
  }
});
export const { resetSubCategories } = categorySlice.actions;
export default categorySlice.reducer;
