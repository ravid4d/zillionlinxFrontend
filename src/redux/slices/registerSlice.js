import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const registerUrl = `${process.env.REACT_APP_API_URL}/api/register`;
const forgotPasswordUrl = `${process.env.REACT_APP_API_URL}/api/forgot-password`;
const resetPasswordUrl = `${process.env.REACT_APP_API_URL}/api/reset-password`;


export const handleRegister = createAsyncThunk(
  "auth/register",
  async (values, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        registerUrl,
        {
          first_name: values?.first_name,
          last_name: values?.last_name,
          email: values?.email,
          password: values?.password,
          password_confirmation: values?.password_confirmation,
          country: values?.country,
          terms_condition: values?.terms_condition,
        }
      );
      return {
        token: response?.data?.data?.token,
        message: response?.data?.message,
      };
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Register failed");
    }
  }
);

export const handleForgotPassword = createAsyncThunk(
  "auth/forgot-password",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(forgotPasswordUrl, { email });

      return {
        token: response?.data?.data?.token || null,
        message: response?.data?.message || "Password reset link sent successfully!",
      };
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status || 500,
        message: error?.response?.data?.message || "Failed to process request.",
      });
    }
  }
);

export const handleResetPassword = createAsyncThunk(
  "auth/reset-password",
  async ( values , { rejectWithValue }) => {
    try {
      const response = await axios.post(resetPasswordUrl,  values );

      return {
        message: response?.data?.message || "Password reset successful! Redirecting...",
      };
    } catch (error) {
      return rejectWithValue({
        status: error?.response?.status || 500,
        message: error?.response?.data?.message || "Failed to reset password.",
      });
    }
  }
);


const registerSlice = createSlice({
  name: "register",
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(handleRegister.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(handleRegister.fulfilled, (state, action) => {
      state.loading = false;
    })
    .addCase(handleRegister.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(handleForgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(handleForgotPassword.fulfilled, (state, action) => {
      state.loading = false;
    })
    .addCase(handleForgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(handleResetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(handleResetPassword.fulfilled, (state, action) => {
      state.loading = false;
    })
    .addCase(handleResetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export default registerSlice.reducer;
