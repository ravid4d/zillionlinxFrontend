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
      // console.log(error);
      return rejectWithValue(error?.response?.data?.message || "Failed to fetch bookmarks");
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
    topLinks: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTopLinks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllTopLinks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topLinks = action.payload;
      })
      .addCase(fetchAllTopLinks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(removeTopLink.fulfilled, (state, action) => {
        console.log(state.topLinks,'topLinks');
        state.topLinks = state?.topLinks?.filter(
          (topLink) => topLink.id !== action.payload
        );
      })
      .addCase(removeTopLink.rejected, (state, action) => {
        state.error = action.payload;
      })
      builder
      .addCase(fetchCategoryWiseBookmarks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoryWiseBookmarks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topLinks = action.payload;
      })
      .addCase(fetchCategoryWiseBookmarks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      builder
      .addCase(addNewBookmark.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addNewBookmark.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload, 'hola dear');
        state.topLinks.push(action.payload.bookmark);
      })
      .addCase(addNewBookmark.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  }
});
export default bookmarkSlice.reducer;
