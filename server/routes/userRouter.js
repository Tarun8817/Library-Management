import express from "express";
import { getAllUsers, registerNewAdmin } from "../controllers/userController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected: Only Admins can fetch all users
router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);

// Public: Register a new Admin (remove auth for first-time registration)
router.post("/add/new-admin", registerNewAdmin);

export default router;
