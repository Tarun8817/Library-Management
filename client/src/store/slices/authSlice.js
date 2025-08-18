import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { act } from "react";

// Create an auth slice for managing authentication state
const authSlice = createSlice({
    name: "auth", // Slice name
    initialState: {
        loading: false,        // Tracks API request loading state
        error: null,           // Stores error messages
        message: null,         // Stores success/info messages
        user: null,            // Stores logged-in user data
        isAuthenticated: false // Tracks whether user is logged in
    },
    reducers: {
        // ---------------- REGISTER ----------------
        registerRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        registerSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message; // Store success message
        },
        registerFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // ---------------- OTP VERIFICATION ----------------
        otpVerificationRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        otpVerificationSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true; // After OTP, mark user authenticated
            state.user = action.payload.user || null;
        },
        otpVerificationFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },


        // ---------------- Login ----------------
        loginRequest(state) {
            state.loading = true;
            state.error = null;
            state.message = null;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true; 
            state.user = action.payload.user || null;
        },
        loginFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        logoutRequest(state){
            state.loading=true;
            state.message=null;
            state.error=null;
        },
        logoutSuccess(state,action){
            state.loading = false;
            state.message = action.payload;
            state.isAuthenticated = false; 
            state.user = action.payload.user || null;
        },
        logoutFailed(state,action){
            state.loading = false;
            state.error =action.payload;
            state,message= null;
        },

        getUserRequest(state){
            state.loading=true;
            state.message=null;
            state.error=null;
        },

        getUserSuccess(state,action){
            state.loading = false;
            state.user = action.payload.user ;
            state.isAuthenticated = true; 
        },
        getUserFailed(state){
            state.loading=false;
            state.user=null;
            state.isAuthenticated=false
        },


        forgotPasswordRequest(state){
            state.loading=true;
            state.message=null;
            state.error=null;
        },
        
        forgotPasswordSuccess(state,action){
            state.loading = false;
            state.message =action.payload;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        },
        forgotPasswordFailed(state){
            state.loading=false;
            state.error=action.payload;
        },
        
        resetPasswordRequest(state){
            state.loading=true;
            state.message=null;
            state.error=null;
        },
        
        resetPasswordSuccess(state,action){
            state.loading = false;
            state.message =action.payload.message;
        },
        resetPasswordFailed(state){
            state.loading=false;
            state.error=action.payload;
        },

        updatePasswordRequest(state){
            state.loading=true;
            state.message=null;
            state.error=null;
        },
        
        updatePasswordSuccess(state,action){
            state.loading = false;
            state.message =action.payload;
        },
        updatePasswordFailed(state){
            state.loading=false;
            state.error=action.payload;
        },

        resetAuthSlice(state){
            state.error = null;
            state.loading = false;
            state.message = null;
            state.user=state.user;
            state.isAuthenticated=state.isAuthenticated
        }
    }
});

// ---------------- ASYNC ACTIONS ----------------

export const resetAuthSlice = () => (dispatch) =>{
    dispatch(authSlice.actions.resetAuthSlice())
}


// Register user thunk
export const register = (data) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.registerRequest());
        const res = await axios.post("http://localhost:4000/api/v1/auth/register", data, {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res)=>{
            dispatch(authSlice.actions.registerSuccess(res.data));
        })
        
    } catch (error) {
        dispatch(
            authSlice.actions.registerFailed(
                error.response?.data?.message || "Registration failed"
            )
        );
    }
};


// OTP verification thunk
export const otpVerification = (email, otp) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.otpVerificationRequest());
        const res = await axios.post(
            "http://localhost:4000/api/v1/auth/verify-otp",
            { email, otp },
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then((res)=>{
            dispatch(authSlice.actions.otpVerificationSuccess(res.data));
        })
    } catch (error) {
        dispatch(
            authSlice.actions.otpVerificationFailed(
                error.response?.data?.message || "OTP verification failed"
            )
        );
    }
};


// Login
export const login = (data) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.loginRequest());
        const res = await axios.post(
            "http://localhost:4000/api/v1/auth/login",
            data,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then((res)=>{
             dispatch(authSlice.actions.loginSuccess(res.data));
        })
    } catch (error) {
        dispatch(
            authSlice.actions.loginFailed(
                error.response?.data?.message || "Login  failed"
            )
        );
    }
}

//Logout
export const logout = () => async (dispatch) => {
    try {
        dispatch(authSlice.actions.logoutRequest());
        const res = await axios.get(
            "http://localhost:4000/api/v1/auth/logout",{
                withCredentials: true,
            })
        .then((res)=>{
             dispatch(authSlice.actions.logoutSuccess(res.data.message));
             dispatch(authSlice.actions.resetAuthSlice());
        })
    } catch (error) {
        dispatch(
            authSlice.actions.logoutFailed(
                error.response?.data?.message || "Logout failed"
            )
        );
    }
};


//GetUser
export const getUser = () => async (dispatch) => {
    try {
        dispatch(authSlice.actions.getUserRequest());
        const res = await axios.get(
            "http://localhost:4000/api/v1/auth/me",{
                withCredentials: true,
            })
        .then((res)=>{
            dispatch(authSlice.actions.getUserSuccess(res.data.message));
        })
    } catch (error) {
        dispatch(
            authSlice.actions.getUserFailed(
                error.response?.data?.message || "Get User failed"
            )
        );
    }
};

//forgot password
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.forgotPasswordRequest());
        const res = await axios.post(
            "http://localhost:4000/api/v1/auth/password/forgot",
            {email},
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then((res)=>{
             dispatch(authSlice.actions.forgotPasswordSuccess(res.data.message));
        })
    } catch (error) {
        dispatch(
            authSlice.actions.forgotPasswordFailed(
                error.response?.data?.message || "Forgot Password failed"
            )
        );
    }
}

//reset password
export const resetPassword = (data,token) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.resetPasswordRequest());
        const res = await axios.put(
            `http://localhost:4000/api/v1/auth/password/reset/${token}`,
            data,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then((res)=>{
             dispatch(authSlice.actions.resetPasswordSuccess(res.data.message));
        })
    } catch (error) {
        dispatch(
            authSlice.actions.resetPasswordFailed(
                error.response?.data?.message || "reset Password failed"
            )
        );
    }
}

//update password
export const updatePassword = (data) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.updatePasswordRequestRequest());
        const res = await axios.put(
            'http://localhost:4000/api/v1/auth/password/update',
            data,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then((res)=>{
             dispatch(authSlice.actions.updatePasswordSuccess(res.data.message));
        })
    } catch (error) {
        dispatch(
            authSlice.actions.updatePasswordFailed(
                error.response?.data?.message || " update Password failed"
            )
        );
    }
}


export default authSlice.reducer;