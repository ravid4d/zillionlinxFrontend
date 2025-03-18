import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../axiosInstance";
const fetchTopLinkUrl = `${process.env.REACT_APP_API_URL}/api/top-links`;
const topLinkUrl = `${process.env.REACT_APP_API_URL}/api/bookmark`;
const getBookmarksUrl = `${process.env.REACT_APP_API_URL}/api/bookmarks`;
const addNewBookmarkUrl = `${process.env.REACT_APP_API_URL}/api/add-bookmark`;
const pinBookmarkUrl = `${process.env.REACT_APP_API_URL}/api/bookmark/`;
const orderBookmarkUrl = `${process.env.REACT_APP_API_URL}/api/bookmark/reorder`;
const googleSearchUrl = `${process.env.REACT_APP_API_URL}/api/search`;

// Fetch All Top Links
export const fetchAllTopLinks = createAsyncThunk(
  "bookmark/fetchAllTopLinks",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(fetchTopLinkUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return { bookmarks: response?.data?.data };
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Failed to fetch Top Links"
      });
    }
  }
);

// Remove an item form list
export const removeTopLink = createAsyncThunk(
  "bookmark/removeTopLink",
  async ({ token, topLinkId }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${topLinkUrl}/${topLinkId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return topLinkId; // Return the ID to remove it from state
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Failed to remove top link"
      });
    }
  }
);

// Get Bookmarks Category wise
export const fetchCategoryWiseBookmarks = createAsyncThunk(
  "bookmark/fetchCategoryWiseBookmarks",
  async ({ token, categoryId, subCategoryId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${getBookmarksUrl}?category_id=${categoryId}&sub_category_id=${subCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return {
        bookmarks: response?.data?.bookmarks,
        message: response?.data?.message
      };
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Failed to fetch bookmarks"
      });
    }
  }
);

export const addNewBookmark = createAsyncThunk(
  "bookmark/addNewBookmark",
  async ({ values, token }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        addNewBookmarkUrl,
        {
          title: values?.title,
          url: values?.url,
          category_id: values?.category_id,
          sub_category_id: values?.sub_category_id,
          add_to: values?.add_to
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      // console.log(response, 'add new');
      return response?.data;
      // return { message: response?.data?.message, bookmark: response?.data?.data };
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Failed to add bookmark"
      });
    }
  }
);

export const pinBookmark = createAsyncThunk(
  "bookmark/pinBookmark",
  async ({ token, bookmarkId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${pinBookmarkUrl}${bookmarkId}/pin`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response?.data?.message;
      // return { message: response?.data?.message, bookmark: response?.data?.data };
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Failed to pin bookmark"
      });
    }
  }
);

export const orderBookmarks = createAsyncThunk(
  "bookmark/orderBookmarks",
  async ({ token, order }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        orderBookmarkUrl,
        { order },
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
        message: error?.response?.data?.message || "Failed to add bookmark"
      });
    }
  }
);

export const googleSearch = createAsyncThunk(
  "bookmarks/googleSearch",
  async ({ token, formData }, { rejectWithValue }) => {
    try {
      let response = await axiosInstance.post(googleSearchUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });
      return response?.data?.data;
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status,
        message: error?.response?.data?.message || "Failed to load bookmarks from google search api."
      });
    }
  }
);

const bookmarkSlice = createSlice({
  name: "bookmark",
  initialState: {
    bookmarks: [],
    bookmark_addto:"",
    bookmark_category:"",
    bookmark_subcategory:"",
    bookmark_message:"",
    isTopLink: true,
    loading: false,
    status: "",
    addBookmarkLoading: false,
    googleLoading: false,
    googleResults: [],
    wikkiResults: [],
    ebayResults: [],
    youtubeResults: [],
    youtubeStaticLink: "",
    wikiStaticLink: "",
    ebayStaticLink: "",
    amazonStaticLink: "",
    error: null
  },
  reducers: {
    callTopLinks: (state) => {
      state.isTopLink = true;
    }
  },
  extraReducers: (builder) => {
    //Fetch Top Links
    builder
      .addCase(fetchAllTopLinks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTopLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = action.payload.bookmarks;
        state.status = action.payload.status;
        state.isTopLink = true;
      })
      .addCase(fetchAllTopLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
        state.bookmarks = []
      })

      //Remove Top Links
      .addCase(removeTopLink.fulfilled, (state, action) => {
        state.bookmarks = state?.bookmarks?.bookmarks?.filter(
          (bookmark) => bookmark.id !== action.payload
        );
      })
      .addCase(removeTopLink.rejected, (state, action) => {
        state.error = action.payload.message;
        state.status = action.payload.status;
      });

    //Fetch category wise bookmarks
    builder
      .addCase(fetchCategoryWiseBookmarks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategoryWiseBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = action.payload?.bookmarks;
        // state.message =  action.payload?.bookmarks?.length === 0 && action.payload?.message
        state.isTopLink = false;
      })
      .addCase(fetchCategoryWiseBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });

    //Add New Bookmarks
    builder
      .addCase(addNewBookmark.pending, (state) => {
        state.addBookmarkLoading = true;
      })
      .addCase(addNewBookmark.fulfilled, (state, action) => {
        state.addBookmarkLoading = false;
        state.bookmark_addto = action.payload.add_to;
        state.bookmark_category = action.payload.category_id;
        state.bookmark_subcategory = action.payload.sub_category_id;
        state.bookmark_message = action.payload.message;
        // state.bookmarks.push(action.payload.bookmark); It is not working because we are not getting data from backend
      })
      .addCase(addNewBookmark.rejected, (state, action) => {
        state.addBookmarkLoading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });

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
        state.error = action.payload.message;
        state.status = action.payload.status;
      });

    builder
      .addCase(orderBookmarks.pending, (state) => {
        state.loading = true;
      })
      .addCase(orderBookmarks.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(orderBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });

    builder
      .addCase(googleSearch.pending, (state) => {
        state.googleLoading = true;
      })
      .addCase(googleSearch.fulfilled, (state, action) => {
        state.googleLoading = false;
        state.googleResults = action.payload?.google_search_results;
        state.wikkiResults = action.payload?.wikimedia_search_results;
        state.ebayResults = action.payload?.ebay_search_results;
        state.youtubeResults = action.payload?.youtube_search_results;
        state.amazonResults = action.payload?.amazon_search_results;
        state.youtubeStaticLink = action.payload?.youtubeStaticLink;
        state.wikiStaticLink = action.payload?.wikiStaticLink;
        state.ebayStaticLink = action.payload?.ebayStaticLink;
        state.amazonStaticLink = action.payload?.amazonStaticLink;
        state.bookmarks = action.payload?.bookmarks;
      })
      .addCase(googleSearch.rejected, (state, action) => {
        state.googleLoading = false;
        state.error = action.payload.message;
        state.status = action.payload.status;
      });
  }
});
export const { callTopLinks } = bookmarkSlice.actions;
export default bookmarkSlice.reducer;
