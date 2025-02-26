import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const registerUrl = `${process.env.REACT_APP_API_URL}/api/register`;


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
          // country: "",
          // userAgreement: false,
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
  }
});

export default registerSlice.reducer;
