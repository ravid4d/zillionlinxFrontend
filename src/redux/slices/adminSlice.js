import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const categoryUrl = `${process.env.REACT_APP_API_URL}/api/admin/categories`;
const deleteuserUrl = `${process.env.REACT_APP_API_URL}/api/admin/user/delete`;
const fetchBookmarkUrl = `${process.env.REACT_APP_API_URL}/api/admin/getAllBookmarks`;
const deleteBookmarkUrl = `${process.env.REACT_APP_API_URL}/api/admin/delete-Bookmarks`;
const updateCategoryUrl = `${process.env.REACT_APP_API_URL}/api/admin/update-categories`;
const deleteCategoryUrl = `${process.env.REACT_APP_API_URL}/api/admin/delete/categories`;

export const deleteCategory = createAsyncThunk(
  "admin/delete-categories",
  async ({ids}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axiosInstance.post(
        deleteCategoryUrl,
        {
          ids: ids
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
        message: error?.response?.data?.message || "Something went wrong!",
        isDuplicateEntry: error?.response?.data?.message?.includes("SQLSTATE[23000]") || false, 
      });
    }
  }
);

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

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async ({ ids, token }, { rejectWithValue }) => {
    try {  
      const response = await axiosInstance.delete(deleteuserUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: { ids }, // Ensure 'ids' is an array
      });

      return {
        ids, // Return deleted IDs
        message: response?.data?.message || "Users deleted successfully",
      };
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status || 500,
        message: error?.response?.data?.message || "Failed to delete users",
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

export const updateCategory = createAsyncThunk(
  "admin/update-categories",
  async ({id, values, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${updateCategoryUrl}/${id}`,
        {
          title: values?.title,
          parent_id: values?.parent_id,
          slug: values?.slug
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
        message: error?.response?.data?.message || "Something went wrong!",
        isDuplicateEntry: error?.response?.data?.message?.includes("SQLSTATE[23000]") || false, // ✅ Detect Duplicate Entry
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

// Fetch All Top Links
export const fetchAllBookmarks = createAsyncThunk(
  "admin/fetchAllBookmarks",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(fetchBookmarkUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Failed to fetch Top Links"
      });
    }
  }
);

export const handleBookmarksPagination = createAsyncThunk(
  "admin/pagination",
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

export const deleteBookmark = createAsyncThunk(
  "admin/deleteBookmark",
  async (id, { getState, rejectWithValue }) => {
    const token = getState().auth?.token;

    try {
      const response = await axiosInstance.post(`${deleteBookmarkUrl}/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        
      });
      return {
        id, // Return deleted IDs
        message: response?.data?.message || "Bookmark deleted successfully",
      };
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status || 500,
        message: error?.response?.data?.message || "Failed to delete bookmark"
      });
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    status: "",
    loading: false,
    categoryLoading: false,
    error: null,
    editingCategory: null,
    totalBookmarks: undefined,
    pagination: [],
    users: [],
    parentCategories: [],
    adminCategories:[],
    adminBookmarks:[],
  },
  reducers: {
    setEditingCategory:(state, action)=>{
      state.editingCategory = action.payload;
    }
  },
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
        state.categoryLoading = true;
        state.error = null;
      })
      .addCase(addNewCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
      })
      .addCase(addNewCategory.rejected, (state, action) => {
        state.categoryLoading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });

      builder
      .addCase(updateCategory.pending, (state) => {
        state.categoryLoading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.categoryLoading = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.categoryLoading = false;
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

      builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => !action.payload.ids?.includes(user.id)); // Remove deleted users
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
      
      builder
      .addCase(fetchAllBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.adminBookmarks = action.payload.data;
        state.totalBookmarks = action.payload.data?.total;
        state.pagination = action.payload.data?.links;
      })
      .addCase(fetchAllBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
      
      builder
      .addCase(handleBookmarksPagination.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleBookmarksPagination.fulfilled, (state, action) => {
        state.loading = false;
        state.adminBookmarks = action.payload.data?.data;
        state.totalBookmarks = action.payload.data?.total;
        state.pagination = action.payload.data?.links;
      })
      .addCase(handleBookmarksPagination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });

      builder
      .addCase(deleteBookmark.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBookmark.fulfilled, (state, action) => {
        state.loading = false;
        state.adminBookmarks = state.adminBookmarks.filter((book) => action.payload.id !== book.id); // Remove deleted bookmark
      })
      .addCase(deleteBookmark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });

      builder
      .addCase(deleteCategory.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.adminCategories = state.adminCategories.filter((cat) => !action.payload.ids?.includes(cat.id));
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  }

});

export const { setEditingCategory } = adminSlice.actions;
export default adminSlice.reducer;
