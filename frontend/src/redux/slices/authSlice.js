import {createSlice, createAsyncThunk, isRejectedWithValue} from "@reduxjs/toolkit";
import axios from "axios";
// retrieve user info and token from localStorage if available
const userfromStorage = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;
 
// check for an existing guest id  in the localstorage or generate a new Date
const intialGuestId = localStorage.getItem("guestId") || `guest_${new Date().getTime()}`;
localStorage.setItem("guestId", intialGuestId);
//  intial state
const initialState = {
    user: userfromStorage,
    guestId: intialGuestId,
    loading: false,
    error: null,
};

// async thank for user login

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, {rejectedWithValue}) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, userData);
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);  //return the user and token
            return response.data;
        } catch (error) {
            return rejectedWithValue(error.response.data);
        }
    }
);

// async thank for user registration

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, {rejectedWithValue}) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, userData);
            localStorage.setItem("userInfo", JSON.stringify(response.data.user));
            localStorage.setItem("userToken", response.data.token);  //return the user and token
            return response.data;
        } catch (error) {
            return rejectedWithValue(error.response.data);
        }
    }
);

// slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            
            state.user = null;
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.removeItem("userInfo");
            localStorage.removeItem("userToken");
            localStorage.setItem("guestId", state.guestId); //set new guestId inn localstorage
        },
        generateNewGuestId: (state) => {
            state.guestId = `guest_${new Date().getTime()}`;
            localStorage.setItem("guestId", state.guestId);
        },
        setOAuthUser: (state, action) => {
            const { user } = action.payload;
            state.user = user;
            state.loading = false;
            state.error = null;
            localStorage.setItem("userInfo", JSON.stringify(user));
            
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    },
});

export const {logout, generateNewGuestId,setOAuthUser} = authSlice.actions;
export default authSlice.reducer;

