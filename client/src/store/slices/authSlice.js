import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Auth slice banaya hai jisme redux state manage hoga
const authSlice = createSlice({
    name: "auth", 
    initialState: {
        loading: false,        // API call chal rahi hai ya nahi
        error: null,           // Error message store karega
        message: null,         // Success / info message store karega
        user: null,            // Current logged-in user ka data
        isAuthenticated: false // Login hua hai ya nahi
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
            state.message = action.payload.message; // Success message
        },
        registerFailed(state, action) {
            state.loading = false;
            state.error = action.payload; // Error message
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
            state.isAuthenticated = true; // OTP ke baad login samjho
            state.user = action.payload.user || null;
        },
        otpVerificationFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // ---------------- LOGIN ----------------
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

        // ---------------- LOGOUT ----------------
        logoutRequest(state) {
            state.loading = true;
            state.message = null;
            state.error = null;
        },
        logoutSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;
            state.isAuthenticated = false; 
            state.user = null; // logout ke baad user null hona chahiye
        },
        logoutFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.message = null;
        },

        // ---------------- GET USER ----------------
        getUserRequest(state) {
            state.loading = true;
            state.message = null;
            state.error = null;
        },
        getUserSuccess(state, action) {
            state.loading = false;
            state.user = action.payload.user; // backend se user data aayega
            state.isAuthenticated = true; 
        },
        getUserFailed(state) {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
        },

        // ---------------- FORGOT PASSWORD ----------------
        forgotPasswordRequest(state) {
            state.loading = true;
            state.message = null;
            state.error = null;
        },
        forgotPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;
        },
        forgotPasswordFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // ---------------- RESET PASSWORD ----------------
        resetPasswordRequest(state) {
            state.loading = true;
            state.message = null;
            state.error = null;
        },
        resetPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
        },
        resetPasswordFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // ---------------- UPDATE PASSWORD ----------------
        updatePasswordRequest(state) {
            state.loading = true;
            state.message = null;
            state.error = null;
        },
        updatePasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;
        },
        updatePasswordFailed(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        // ---------------- RESET AUTH SLICE ----------------
        resetAuthSlice(state) {
            state.error = null;
            state.loading = false;
            state.message = null;
            // user & isAuthenticated same hi rahenge
        }
    }
});

// ---------------- ASYNC ACTIONS ----------------

// Slice ke reducers ko export kar rahe hai
export const resetAuthSlice = () => (dispatch) => {
    dispatch(authSlice.actions.resetAuthSlice());
};

// Register user API
export const register = (data) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.registerRequest());
        const res = await axios.post("http://localhost:4000/api/v1/auth/register", data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        dispatch(authSlice.actions.registerSuccess(res.data));
    } catch (error) {
        dispatch(
            authSlice.actions.registerFailed(error.response?.data?.message || "Registration failed")
        );
    }
};

// OTP Verification API
export const otpVerification = (email, otp) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.otpVerificationRequest());
        const res = await axios.post(
            "http://localhost:4000/api/v1/auth/verify-otp",
            { email, otp },
            { withCredentials: true, headers: { "Content-Type": "application/json" } }
        );
        dispatch(authSlice.actions.otpVerificationSuccess(res.data));
    } catch (error) {
        dispatch(
            authSlice.actions.otpVerificationFailed(error.response?.data?.message || "OTP failed")
        );
    }
};

// Login API
export const login = (data) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.loginRequest());
        const res = await axios.post("http://localhost:4000/api/v1/auth/login", data, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
        });
        dispatch(authSlice.actions.loginSuccess(res.data));
    } catch (error) {
        dispatch(
            authSlice.actions.loginFailed(error.response?.data?.message || "Login failed")
        );
    }
};

// Logout API
export const logout = () => async (dispatch) => {
    try {
        dispatch(authSlice.actions.logoutRequest());
        const res = await axios.get("http://localhost:4000/api/v1/auth/logout", {
            withCredentials: true,
        });
        dispatch(authSlice.actions.logoutSuccess(res.data.message));
    } catch (error) {
        dispatch(
            authSlice.actions.logoutFailed(error.response?.data?.message || "Logout failed")
        );
    }
};

// Get User API
export const getUser = () => async (dispatch) => {
    try {
        dispatch(authSlice.actions.getUserRequest());
        const res = await axios.get("http://localhost:4000/api/v1/auth/me", {
            withCredentials: true,
        });
        dispatch(authSlice.actions.getUserSuccess(res.data));
    } catch (error) {
        dispatch(
            authSlice.actions.getUserFailed(error.response?.data?.message || "Get User failed")
        );
    }
};

// Forgot Password API
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.forgotPasswordRequest());
        const res = await axios.post(
            "http://localhost:4000/api/v1/auth/password/forgot",
            { email },
            { withCredentials: true, headers: { "Content-Type": "application/json" } }
        );
        dispatch(authSlice.actions.forgotPasswordSuccess(res.data.message));
    } catch (error) {
        dispatch(
            authSlice.actions.forgotPasswordFailed(error.response?.data?.message || "Forgot failed")
        );
    }
};

// Reset Password API
export const resetPassword = (data, token) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.resetPasswordRequest());
        const res = await axios.put(
            `http://localhost:4000/api/v1/auth/password/reset/${token}`,
            data,
            { withCredentials: true, headers: { "Content-Type": "application/json" } }
        );
        dispatch(authSlice.actions.resetPasswordSuccess(res.data));
    } catch (error) {
        dispatch(
            authSlice.actions.resetPasswordFailed(error.response?.data?.message || "Reset failed")
        );
    }
};

// Update Password API
export const updatePassword = (data) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.updatePasswordRequest()); // FIX: pehle galat tha
        const res = await axios.put(
            "http://localhost:4000/api/v1/auth/password/update",
            data,
            { withCredentials: true, headers: { "Content-Type": "application/json" } }
        );
        dispatch(authSlice.actions.updatePasswordSuccess(res.data.message));
    } catch (error) {
        dispatch(
            authSlice.actions.updatePasswordFailed(error.response?.data?.message || "Update failed")
        );
    }
};

export default authSlice.reducer;
