import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const loginUrl = `${process.env.REACT_APP_API_URL}/api/login`;

const TOKEN_KEY = "authToken";
const storedToken = localStorage.getItem(TOKEN_KEY);

export const handleLogin = createAsyncThunk(
  "auth/login",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        loginUrl,
        {
          type: "email",
          email: values?.email,
          password: values?.password,
        }
      );
      
      const token = response?.data?.data?.token;
      console.log(token, 'kk');
      const message = response?.message;
      if(token !== undefined) {
        localStorage.setItem(TOKEN_KEY, token);
      }
      return {token, message};
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: storedToken,
    isLoggedIn: !!storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem(TOKEN_KEY); 
    },
  },
  extraReducers: (builder) => {
    //Fetch Top Links
    builder
    .addCase(handleLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(handleLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    })
    .addCase(handleLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
