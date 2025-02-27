import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const fetchTopLinkUrl = `${process.env.REACT_APP_API_URL}/api/top-links`;
const topLinkUrl = `${process.env.REACT_APP_API_URL}/api/bookmark`;
const getBookmarksUrl = `${process.env.REACT_APP_API_URL}/api/bookmarks`;
const addNewBookmarkUrl = `${process.env.REACT_APP_API_URL}/api/add-bookmark`;
const pinBookmarkUrl = `${process.env.REACT_APP_API_URL}/api/bookmark/`;

// Fetch All Top Links
export const fetchAllTopLinks = createAsyncThunk(
  "bookmark/fetchAllTopLinks",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(fetchTopLinkUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { bookmarks: response.data.data };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch Top Links");
    }
  }
);

// Remove an item form list
export const removeTopLink = createAsyncThunk(
  "bookmark/removeTopLink",
  async ({ token, topLinkId }, { rejectWithValue }) => {
    try {
      await axios.delete(`${topLinkUrl}/${topLinkId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return topLinkId; // Return the ID to remove it from state
    } catch (error) {
      
      return rejectWithValue(error?.response?.data?.message || "Failed to remove top link");
    }
  }
);

// Get Bookmarks Category wise
export const fetchCategoryWiseBookmarks = createAsyncThunk(
  "bookmark/fetchCategoryWiseBookmarks",
  async ({ token, categoryId, subCategoryId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${getBookmarksUrl}?category_id=${categoryId}&sub_category_id=${subCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return {
        bookmarks:response?.data?.bookmarks,
        message:response?.data?.message
      }
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch bookmarks");
    }
  }
);

export const addNewBookmark = createAsyncThunk(
  "bookmark/addNewBookmark",
  async ({ values, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        addNewBookmarkUrl,
        {
          title: values?.title,
          url: values?.url,
          category_id: values?.category_id,
          sub_category_id: values?.sub_category_id,
          add_to: values?.add_to,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data?.message;
      // return { message: response?.data?.message, bookmark: response?.data?.data };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to add bookmark");
    }
  }
);

export const pinBookmark = createAsyncThunk(
  "bookmark/pinBookmark",
  async ({ token, bookmarkId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${pinBookmarkUrl}${bookmarkId}/pin`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response, 'response from pin bookmark API.');
      // return response?.data?.message;
      // return { message: response?.data?.message, bookmark: response?.data?.data };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to add bookmark");
    }
  }
);


const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState: {
    bookmarks:[],
    // topLinks: [],
    loading: false,
    addBookmarkLoading:false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    //Fetch Top Links
    builder
      .addCase(fetchAllTopLinks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTopLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = action.payload;
      })
      .addCase(fetchAllTopLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Remove Top Links
      .addCase(removeTopLink.fulfilled, (state, action) => {
        state.bookmarks.bookmarks = state?.bookmarks?.bookmarks?.filter(
          (bookmark) => bookmark.id !== action.payload
        );
      })
      .addCase(removeTopLink.rejected, (state, action) => {
        state.error = action.payload;
      })

      //Fetch category wise bookmarks
      builder
      .addCase(fetchCategoryWiseBookmarks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryWiseBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        let payload = action.payload?.bookmarks?.length===0?{bookmarks:[], message:action.payload?.message}:action.payload
        state.bookmarks = payload;
      })
      .addCase(fetchCategoryWiseBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Add New Bookmarks
      builder
      .addCase(addNewBookmark.pending, (state) => {
        state.addBookmarkLoading = true;
      })
      .addCase(addNewBookmark.fulfilled, (state, action) => {
        state.addBookmarkLoading = false;
        // state.bookmarks.push(action.payload.bookmark); It is not working because we are not getting data from backend
      })
      .addCase(addNewBookmark.rejected, (state, action) => {
        state.addBookmarkLoading = false;
        state.error = action.payload;
      })

      builder
      .addCase(pinBookmark.pending, (state) => {
        state.addBookmarkLoading = true;
      })
      .addCase(pinBookmark.fulfilled, (state, action) => {
        state.addBookmarkLoading = false;
        // state.bookmarks.push(action.payload.bookmark); It is not working because we are not getting data from backend
      })
      .addCase(pinBookmark.rejected, (state, action) => {
        state.addBookmarkLoading = false;
        state.error = action.payload;
      });
  }
});
export default bookmarkSlice.reducer;
