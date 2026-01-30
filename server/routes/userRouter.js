import express from "express";
import { getAllUsers, registerNewAdmin } from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ----------------------------------------
// USER MANAGEMENT ROUTES
// ----------------------------------------

// Get all verified users
// Endpoint: GET /all
// Access: Admin only (protected by isAuthenticated + isAuthorized)
// Returns a list of all users who have verified their accounts
router.get("/all", 
    isAuthenticated, 
    isAuthorized("Admin"), 
    getAllUsers
);

// Register a new Admin
// Endpoint: POST /add/new-admin
// Access: Public for first-time registration (authentication can be skipped)
// Body: { name, email, password, avatar }
// Uploads avatar to Cloudinary, hashes password, and creates a new Admin account
router.post("/add/new-admin", registerNewAdmin);

export default router;
