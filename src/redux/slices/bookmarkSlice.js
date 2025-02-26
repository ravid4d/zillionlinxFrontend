import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const topLinkUrl = `${process.env.REACT_APP_API_URL}/api/top-links`;
const getBookmarksUrl = `${process.env.REACT_APP_API_URL}/api/bookmarks`;
const addNewBookmarkUrl = `${process.env.REACT_APP_API_URL}/api/add-bookmark`;

// Fetch All Top Links
export const fetchAllTopLinks = createAsyncThunk(
  "bookmark/fetchAllTopLinks",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(topLinkUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch Top Links");
    }
  }
);

// Remove an item form list
export const removeTopLink = createAsyncThunk(
  "bookmark/removeTopLink",
  async ({ token, topLinkId, type }, { rejectWithValue }) => {
    try {
      console.log(topLinkId, 'hidear');
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
      console.log(token, categoryId, subCategoryId, 'data are');
      const response = await axios.get(
        `${getBookmarksUrl}?category_id=${categoryId}&sub_category_id=${subCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data?.bookmarks;
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
      return { message: response?.data?.message, bookmark: response?.data?.data };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Failed to add bookmark");
    }
  }
);


const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState: {
    bookmarks:[],
    topLinks: [],
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
        state.topLinks = action.payload;
      })
      .addCase(fetchAllTopLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //Remove Top Links
      .addCase(removeTopLink.fulfilled, (state, action) => {
        console.log(action.payload, 'payload is');
        state.topLinks = state?.topLinks?.filter(
          (topLink) => topLink.id !== action.payload
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
        state.bookmarks = action.payload;
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
        state.bookmarks.push(action.payload.bookmark);
      })
      .addCase(addNewBookmark.rejected, (state, action) => {
        state.addBookmarkLoading = false;
        state.error = action.payload;
      });
  }
});
export default bookmarkSlice.reducer;
