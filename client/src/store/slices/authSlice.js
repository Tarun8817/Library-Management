import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ------------------- INITIAL STATE WITH PERSISTENCE -------------------
const getInitialState = () => {
    try {
        const storedUser = localStorage.getItem('user');
        const storedAuth = localStorage.getItem('isAuthenticated');

        if (storedUser && storedAuth === 'true') {
            return {
                loading: false,
                error: null,
                message: null,
                user: JSON.parse(storedUser),
                isAuthenticated: true,
            };
        }
    } catch (error) {
        console.error('Error loading auth state from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
    }

    return {
        loading: false,
        error: null,
        message: null,
        user: null,
        isAuthenticated: false,
    };
};

// ------------------- AUTH SLICE -------------------
const authSlice = createSlice({
    name: "auth",
    initialState: getInitialState(),
    reducers: {
        // ---------------- COMMON ----------------
        resetAuthSlice(state) {
            state.error = null;
            state.loading = false;
            state.message = null;
        },
        clearMessages(state) {
            state.error = null;
            state.message = null;
        },

        // ---------------- REGISTER ----------------
        registerRequest(state) { state.loading = true; state.error = null; state.message = null; },
        registerSuccess(state, action) { state.loading = false; state.message = action.payload.message; },
        registerFailed(state, action) { state.loading = false; state.error = action.payload; },

        // ---------------- OTP ----------------
        otpVerificationRequest(state) { state.loading = true; state.error = null; state.message = null; },
        otpVerificationSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user || null;
            // Store user data in localStorage for persistence
            if (action.payload.user) {
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                localStorage.setItem('isAuthenticated', 'true');
            }
        },
        otpVerificationFailed(state, action) { state.loading = false; state.error = action.payload; },

        // ---------------- LOGIN ----------------
        loginRequest(state) { state.loading = true; state.error = null; state.message = null; },
        loginSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;
            state.isAuthenticated = true;
            state.user = action.payload.user || null;
            // Store user data in localStorage for persistence
            if (action.payload.user) {
                localStorage.setItem('user', JSON.stringify(action.payload.user));
                localStorage.setItem('isAuthenticated', 'true');
            }
        },
        loginFailed(state, action) { state.loading = false; state.error = action.payload; },

        // ---------------- LOGOUT ----------------
        logoutRequest(state) { state.loading = true; state.error = null; state.message = null; },
        logoutSuccess(state, action) {
            state.loading = false;
            state.message = action.payload;
            state.isAuthenticated = false;
            state.user = null;
            // Clear localStorage on logout
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
        },
        logoutFailed(state, action) { state.loading = false; state.error = action.payload; },

        // ---------------- GET USER ----------------
        getUserRequest(state) { state.loading = true; state.error = null; state.message = null; },
        getUserSuccess(state, action) {
            state.loading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            // Store user data in localStorage for persistence
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('isAuthenticated', 'true');
        },
        getUserFailed(state, action) {
            state.loading = false;
            // Only reset auth state if we get a 401/403 error (token expired/invalid)
            // Don't reset on network errors or other issues
            const errorMessage = action.payload;
            if (errorMessage && (errorMessage.includes('not authenticated') || errorMessage.includes('Invalid') || errorMessage.includes('expired'))) {
                state.user = null;
                state.isAuthenticated = false;
                // Clear localStorage when auth fails
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
            }
            state.error = action.payload;
        },

        // ---------------- SILENT GET USER (for initial checks) ----------------
        silentGetUserRequest(state) { state.loading = true; },
        silentGetUserSuccess(state, action) {
            state.loading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
            // Store user data in localStorage for persistence
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('isAuthenticated', 'true');
        },
        silentGetUserFailed(state, action) {
            state.loading = false;
            // Reset auth state but don't set error (to prevent toast)
            const errorMessage = action.payload;

            // Only clear auth state for actual authentication errors, not network errors
            if (errorMessage && (errorMessage.includes('not authenticated') || errorMessage.includes('Invalid') || errorMessage.includes('expired'))) {
                state.user = null;
                state.isAuthenticated = false;
                // Clear localStorage when auth fails
                localStorage.removeItem('user');
                localStorage.removeItem('isAuthenticated');
            }
            // For network errors, keep the user logged in temporarily
            // The localStorage state will persist until server is available

            // Don't set error for silent checks
        },

        // ---------------- FORGOT / RESET PASSWORD ----------------
        forgotPasswordRequest(state) { state.loading = true; state.error = null; state.message = null; },
        forgotPasswordSuccess(state, action) { state.loading = false; state.message = action.payload; },
        forgotPasswordFailed(state, action) { state.loading = false; state.error = action.payload; },

        resetPasswordRequest(state) { state.loading = true; state.error = null; state.message = null; },
        resetPasswordSuccess(state, action) { state.loading = false; state.message = action.payload.message; },
        resetPasswordFailed(state, action) { state.loading = false; state.error = action.payload; },

        updatePasswordRequest(state) { state.loading = true; state.error = null; state.message = null; },
        updatePasswordSuccess(state, action) { state.loading = false; state.message = action.payload; },
        updatePasswordFailed(state, action) { state.loading = false; state.error = action.payload; },
    }
});

// ------------------- EXPORT REDUCER -------------------
export default authSlice.reducer;

// ------------------- HELPER TO RESET SLICE -------------------
export const resetAuthSlice = () => (dispatch) => {
    dispatch(authSlice.actions.resetAuthSlice());
};

export const clearMessages = () => (dispatch) => {
    dispatch(authSlice.actions.clearMessages());
};

// ------------------- ASYNC ACTIONS -------------------
const API = axios.create({
    baseURL: "http://localhost:4000/api/v1/auth",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// Register
export const register = (data) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.registerRequest());
        const res = await API.post("/register", data);
        dispatch(authSlice.actions.registerSuccess(res.data));
    } catch (error) {
        dispatch(authSlice.actions.registerFailed(error.response?.data?.message || "Registration failed"));
    }
};

// OTP Verification
export const otpVerification = (email, otp) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.otpVerificationRequest());
        const res = await API.post("/verify-otp", { email, otp });
        dispatch(authSlice.actions.otpVerificationSuccess(res.data));
    } catch (error) {
        dispatch(authSlice.actions.otpVerificationFailed(error.response?.data?.message || "OTP failed"));
    }
};

// Login
export const login = (data) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.loginRequest());
        const res = await API.post("/login", data);
        dispatch(authSlice.actions.loginSuccess(res.data));
    } catch (error) {
        dispatch(authSlice.actions.loginFailed(error.response?.data?.message || "Login failed"));
    }
};

// Logout
export const logout = () => async (dispatch) => {
    try {
        dispatch(authSlice.actions.logoutRequest());
        const res = await API.get("/logout");
        dispatch(authSlice.actions.logoutSuccess(res.data.message));
    } catch (error) {
        dispatch(authSlice.actions.logoutFailed(error.response?.data?.message || "Logout failed"));
    }
};

// Get User
export const getUser = () => async (dispatch) => {
    try {
        dispatch(authSlice.actions.getUserRequest());
        const res = await API.get("/me");
        dispatch(authSlice.actions.getUserSuccess(res.data));
    } catch (error) {
        dispatch(authSlice.actions.getUserFailed(error.response?.data?.message || "Get User failed"));
    }
};

// Silent Get User (for initial app load - doesn't show errors)
export const silentGetUser = () => async (dispatch) => {
    try {
        dispatch(authSlice.actions.silentGetUserRequest());
        const res = await API.get("/me");
        dispatch(authSlice.actions.silentGetUserSuccess(res.data));
    } catch (error) {
        dispatch(authSlice.actions.silentGetUserFailed(error.response?.data?.message || "Get User failed"));
    }
};

// Forgot Password
export const forgotPassword = (email) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.forgotPasswordRequest());
        const res = await API.post("/password/forgot", { email });
        dispatch(authSlice.actions.forgotPasswordSuccess(res.data.message));
    } catch (error) {
        dispatch(authSlice.actions.forgotPasswordFailed(error.response?.data?.message || "Forgot failed"));
    }
};

// Reset Password
export const resetPassword = (data, token) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.resetPasswordRequest());
        const res = await API.put(`/password/reset/${token}`, data);
        dispatch(authSlice.actions.resetPasswordSuccess(res.data));
    } catch (error) {
        dispatch(authSlice.actions.resetPasswordFailed(error.response?.data?.message || "Reset failed"));
    }
};

// Update Password
export const updatePassword = (data) => async (dispatch) => {
    try {
        dispatch(authSlice.actions.updatePasswordRequest());
        const res = await API.put("/password/update", data);
        dispatch(authSlice.actions.updatePasswordSuccess(res.data.message));
    } catch (error) {
        dispatch(authSlice.actions.updatePasswordFailed(error.response?.data?.message || "Update failed"));
    }
};
