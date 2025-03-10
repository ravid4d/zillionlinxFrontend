import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const allUsersUrl = `${process.env.REACT_APP_API_URL}/api/admin/users`;

export const getAllUsers = createAsyncThunk("users/getAllUsers", async(_, {getState, rejectWithValue}) => {
    try {
        let token = getState().auth.token;
        console.log(token, 'this is the token baby');
        let response = await axios.get(allUsersUrl, {
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        console.log(response, 'this is user response');
    } catch (error) {
        return rejectWithValue(error?.response?.data?.message || "");
    }
});

const userSlice = createSlice({
    name:"users",
    initialState:{},
    reducers:{},
    extraReducers:(builder)=>{

    }
});

// export const {} = userSlice.actions;
export default userSlice.reducer;