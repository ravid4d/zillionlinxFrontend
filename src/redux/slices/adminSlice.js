import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";

const categoryUrl = `${process.env.REACT_APP_API_URL}/api/admin/categories`;
const deleteuserUrl = `${process.env.REACT_APP_API_URL}/api/admin/user/delete`;
const fetchBookmarkUrl = `${process.env.REACT_APP_API_URL}/api/admin/getAllBookmarks`;
const deleteBookmarkUrl = `${process.env.REACT_APP_API_URL}/api/admin/delete-Bookmarks`;
const updateCategoryUrl = `${process.env.REACT_APP_API_URL}/api/admin/update-categories`;
const deleteCategoryUrl = `${process.env.REACT_APP_API_URL}/api/admin/delete/categories`;
const categoryReorderUrl = `${process.env.REACT_APP_API_URL}/api/admin/categories/reorder`;
const linkAdminUrl = `${process.env.REACT_APP_API_URL}/api/admin/listing-admin-bookmark`;
const deleteLinkUrl = `${process.env.REACT_APP_API_URL}/api/admin/delete-admin-bookmark`;

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
      let parentCategories = response?.data?.data?.data?.filter(
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
  async (token, { getState, rejectWithValue }) => {
    try {
      let searchQuery = getState().admin?.searchQuery;

      const response = await axiosInstance.get(`${categoryUrl}?title=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Login failed"
      });
    }
  }
);

export const handleCategoryPagination = createAsyncThunk(
  "users/pagination",
  async ({ url, token }, { rejectWithValue }) => {
    try {
      let response = await axiosInstance.get(url, {
        headers: {  
          Authorization: `Bearer ${token}`
        }
      });
      return response?.data?.data;
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

export const fetchAllBookmarks = createAsyncThunk(
  "admin/fetchAllBookmarks",
  async (token, { getState, rejectWithValue }) => {
    try {
      let searchQuery = getState().admin?.searchQuery;

      const response = await axiosInstance.get(`${fetchBookmarkUrl}?search=${searchQuery}`, {
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
      return response?.data?.data;
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
      const response = await axiosInstance.post(`${deleteBookmarkUrl}`, id, {
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

export const categoryReorder = createAsyncThunk(
  "admin/categoryReorder",
  async ({token, order}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(categoryReorderUrl, {order}, {
        headers: {
          Authorization: `Bearer ${token}`
        },        
      });
      return response?.data?.message;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Failed to add bookmark"
      });
    }
  }
);

export const linkListing = createAsyncThunk("admin/linkListing", async({token},{getState, rejectWithValue})=>{
  try {
    let title = getState().admin?.searchQuery;
    
    let url = title ? `${linkAdminUrl}?search=${title}` : linkAdminUrl;
    let response = await axiosInstance.get(url, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    return response?.data?.data;
  } catch (error) {
    return rejectWithValue({
      status: error?.response?.data?.status,
      message: error?.response?.data?.message || "Failed to remove bookmarks from top links"
    });
  }
})

export const handleLinksPagination = createAsyncThunk(
  "admin/linkPagination",
  async ({ url, token }, { rejectWithValue }) => {
    try {
      let response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message:
          error?.response?.data?.message ||
          "Error While getting the links via pagination."
      });
    }
  }
);

export const deleteLink = createAsyncThunk("bookmarks/deleteLink", async({token, ids},{rejectWithValue})=>{
  try {
   let response = await axiosInstance.post(deleteLinkUrl, {ids}, {
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    return response?.data?.message;
  } catch (error) {
    return rejectWithValue({
      status: error?.response?.data?.status,
      message: error?.response?.data?.message || "Failed to remove bookmarks from top links"
    });
  }
})


const adminSlice = createSlice({
  name: "admin",
  initialState: {
    status: "",
    searchQuery: "",
    loading:{},
    error: {},
    categoryLoading: false,
    editingCategory: null,
    totalCategories: undefined,
    paginationCategories: [],
    totalBookmarks: undefined,
    pagination: [],
    users: [],
    parentCategories: [],
    adminCategories:[],
    adminBookmarks:[],
    links:[],
    totalLinks: undefined,
    paginationLinks: [],
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setEditingCategory:(state, action)=>{
      state.editingCategory = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Delete Category
    builder
      .addCase(deleteCategory.pending, (state, action) => {
        state.loading.getAdminCategory = true;
        state.error.getAdminCategory = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading.getAdminCategory = false;
        state.adminCategories = state.adminCategories.filter((cat) => !action.payload.ids?.includes(cat.id));
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading.getAdminCategory = false;
        state.error.getAdminCategory = action.payload.message;
        state.status = action.payload.status;
      });
    
    // Get Parent Categories
    builder
      .addCase(getParentCategories.pending, (state) => {
        state.loading.getParentCategories = true;
        state.error.getParentCategories = null;
      })
      .addCase(getParentCategories.fulfilled, (state, action) => {
        state.loading.getParentCategories = false;
        state.parentCategories = action.payload;
      })
      .addCase(getParentCategories.rejected, (state, action) => {
        state.loading.getParentCategories = false;
        state.error.getParentCategories = action.payload.message;
        state.status = action.payload.status;
      });

    // Delete User
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading.deleteUser = true;
        state.error.deleteUser = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading.deleteUser = false;
        state.users = state.users.filter((user) => !action.payload.ids?.includes(user.id)); // Remove deleted users
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading.deleteUser = false;
        state.error.deleteUser = action.payload.message;
      });

    // Add New Category
    builder
      .addCase(addNewCategory.pending, (state) => {
        state.loading.addNewCategory = true;
        state.error.addNewCategory = null;
      })
      .addCase(addNewCategory.fulfilled, (state, action) => {
        state.loading.addNewCategory = false;
      })
      .addCase(addNewCategory.rejected, (state, action) => {
        state.loading.addNewCategory = false;
        state.error.addNewCategory = action.payload.message;
        state.status = action.payload.status;
      });

    // Update Category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading.addNewCategory = true;
        state.error.addNewCategory = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading.addNewCategory = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading.addNewCategory = false;
        state.error.addNewCategory = action.payload.message;
        state.status = action.payload.status;
      });

    // Get Admin Categories
    builder
      .addCase(getAdminCategory.pending, (state) => {
        state.loading.getAdminCategory = true;
        state.error.getAdminCategory = null;
      })
      .addCase(getAdminCategory.fulfilled, (state, action) => {
        state.loading.getAdminCategory = false;
        state.adminCategories = action.payload.data;
        state.totalCategories = action.payload?.total;
        state.paginationCategories = action.payload?.links;
      })
      .addCase(getAdminCategory.rejected, (state, action) => {
        state.loading.getAdminCategory = false;
        state.error.getAdminCategory = action.payload.message;
        state.status = action.payload.status;
      });

    // Handle Category Pagination
    builder
      .addCase(handleCategoryPagination.pending, (state) => {
        state.loading.getAdminCategory = true;
        state.error.getAdminCategory = null;
      })
      .addCase(handleCategoryPagination.fulfilled, (state, action) => {
        state.loading.getAdminCategory = false;
        state.adminCategories = action.payload.data;
        state.totalCategories = action.payload?.total;
        state.paginationCategories = action.payload?.links;
      })
      .addCase(handleCategoryPagination.rejected, (state, action) => {
        state.loading.getAdminCategory = false;
        state.error.getAdminCategory = action.payload.message;
        state.status = action.payload.status;
      });
      
    // Fetch All Bookmarks
    builder
      .addCase(fetchAllBookmarks.pending, (state) => {
        state.loading.fetchAllBookmarks = true;
        state.error.fetchAllBookmarks = null;
      })
      .addCase(fetchAllBookmarks.fulfilled, (state, action) => {
        state.loading.fetchAllBookmarks = false;
        state.adminBookmarks = action.payload.data;
        state.totalBookmarks = action.payload?.total;
        state.pagination = action.payload?.links;
      })
      .addCase(fetchAllBookmarks.rejected, (state, action) => {
        state.loading.fetchAllBookmarks = false;
        state.error.fetchAllBookmarks = action.payload.message;
        state.status = action.payload.status;
      });
      
    // Bookmark Pagination
      builder
      .addCase(handleBookmarksPagination.pending, (state, action) => {
        state.loading.fetchAllBookmarks = true;
        state.error.fetchAllBookmarks = null;
      })
      .addCase(handleBookmarksPagination.fulfilled, (state, action) => {
        state.loading.fetchAllBookmarks = false;
        state.adminBookmarks = action.payload.data;
        state.totalBookmarks = action.payload?.total;
        state.pagination = action.payload?.links;
      })
      .addCase(handleBookmarksPagination.rejected, (state, action) => {
        state.loading.fetchAllBookmarks = false;
        state.error.fetchAllBookmarks = action.payload.message;
        state.status = action.payload.status;
      });

    // Delete Bookmark
    builder
      .addCase(deleteBookmark.pending, (state) => {
        state.loading.fetchAllBookmarks = true;
        state.error.fetchAllBookmarks = null;
      })
      .addCase(deleteBookmark.fulfilled, (state, action) => {
        state.loading.fetchAllBookmarks = false;
        state.adminBookmarks = state.adminBookmarks.filter((book) => action.payload.id !== book.bookmark_id); // Remove deleted bookmark
      })
      .addCase(deleteBookmark.rejected, (state, action) => {
        state.loading.fetchAllBookmarks = false;
        state.error.fetchAllBookmarks = action.payload.message;
      });

    // Category Re-Order
    builder
      .addCase(categoryReorder.pending, (state) => {
        state.loading.getAdminCategory = true;
        state.error.getAdminCategory = null;
      })
      .addCase(categoryReorder.fulfilled, (state, action) => {
        state.loading.getAdminCategory = false;
      })
      .addCase(categoryReorder.rejected, (state, action) => {
        state.loading.getAdminCategory = false;
        state.error.getAdminCategory = action.payload.message;
        state.status = action.payload.status;
      })

    // Instant Links
    builder
      .addCase(linkListing?.pending, (state, action)=>{
        state.loading.linkListing=true;
        state.error.linkListing=null;
      })
      .addCase(linkListing?.fulfilled, (state, action)=>{
        state.loading.linkListing=false;
        state.links = action.payload.data;
        state.totalLinks = action.payload?.total;
        state.paginationLinks = action.payload?.links;
      })
      .addCase(linkListing?.rejected, (state, action)=>{
        state.loading.linkListing=false;
        state.error.linkListing = action.payload;
        state.status = action.payload.status;
      })

    // Instant Links Pagination
    builder
      .addCase(handleLinksPagination.pending, (state, action) => {
        state.loading.linkListing = true;
        state.error.linkListing = null;
      })
      .addCase(handleLinksPagination.fulfilled, (state, action) => {
        state.loading.linkListing = false;
        state.links = action.payload.data;
        state.totalLinks = action.payload?.total;
        state.paginationLinks = action.payload?.links;
      })
      .addCase(handleLinksPagination.rejected, (state, action) => {
        state.loading.linkListing = false;
        state.error.linkListing = action.payload.message;
        state.status = action.payload.status;
      })
      
    // Delete Instant Link
      builder.addCase(deleteLink?.pending, (state, action)=>{
        state.loading.linkListing=true;
        state.error.linkListing=null;
      })
      .addCase(deleteLink?.fulfilled, (state, action)=>{
        state.loading.linkListing=false;
        state.links = state?.links?.filter(
          (link) => link.id !== action.payload
        );        
      })
      .addCase(deleteLink?.rejected, (state, action)=>{
        state.loading.linkListing=false;
        state.error.linkListing = action.payload
      })
  }

});

export const { setSearchQuery, setEditingCategory } = adminSlice.actions;
export default adminSlice.reducer;
