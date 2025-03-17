import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const allUsersUrl = `${process.env.REACT_APP_API_URL}/api/admin/users`;

export const getAllUsers = createAsyncThunk("users/getAllUsers", async(_, {getState, rejectWithValue}) => {
    try {
        let token = getState().auth.token;
        let response = await axios.get(allUsersUrl, {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        return response?.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "");
    }
});

export const handleUsersPagination = createAsyncThunk("users/pagination", async({url, token}, {rejectWithValue})=>{
    try {
        let response = await axios.get(url, {
            headers:{
              Authorization:`Bearer ${token}`
            }
          });
          return response?.data;   
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "");
    }
})

const userSlice = createSlice({
    name:"users",
    initialState:{
        users:[],
        totalUsers:undefined,
        user:{},
        pagination:[],
        userLoading:false,
        userError:null
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllUsers.pending, (state, action)=>{
            state.userLoading = true;
            state.error = null;
        })
        .addCase(getAllUsers.fulfilled, (state, action)=>{
            state.userLoading = false;
            state.users = action.payload.data?.data;
            state.totalUsers = action.payload.data?.total;
            state.pagination = action.payload.data?.links;
        })
        .addCase(getAllUsers.rejected, (state, action)=>{
            state.userLoading = false;
            state.error = action.payload;
        });
        builder.addCase(handleUsersPagination.pending, (state, action)=>{
            state.userLoading = true;
            state.error = null;
        })
        .addCase(handleUsersPagination.fulfilled, (state, action)=>{
            state.userLoading = false;
            state.users = action.payload.data?.data;
            state.totalUsers = action.payload.data?.total;
            state.pagination = action.payload.data?.links;
        })
        .addCase(handleUsersPagination.rejected, (state, action)=>{
            state.userLoading = false;
            state.error = action.payload;
        })
    }
});

// export const {} = userSlice.actions;
export default userSlice.reducer;