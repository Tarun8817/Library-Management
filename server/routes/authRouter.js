import express from "express";
import { 
  login, 
  register, 
  verifyOTP,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
  updatePassword
} from "../controllers/authController.js";

import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ----------------------------------------
// USER AUTHENTICATION ROUTES
// ----------------------------------------

// Register a new user
// Body: { name, email, password }
router.post("/register", register);

// Verify OTP sent to email after registration
// Body: { email, otp }
router.post("/verify-otp", verifyOTP);

// User login
// Body: { email, password }
router.post("/login", login);

// Logout user (requires authentication)
// Clears the JWT cookie
router.get("/logout", isAuthenticated, logout);

// Get currently logged-in user info (requires authentication)
router.get("/me", isAuthenticated, getUser);

// Forgot password - send reset email
// Body: { email }
router.post("/password/forgot", forgotPassword);

// Reset password using token sent via email
// Params: { token }
// Body: { password, confirmPassword }
router.put("/password/reset/:token", resetPassword);

// Update password while logged in (requires authentication)
// Body: { currentPassword, newPassword, confirmNewPassword }
router.put("/password/update", isAuthenticated, updatePassword);

export default router;
