import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { errorMiddleware } from "./middlewares/errorMiddlewares.js";
import authRouter from "./routes/authRouter.js";
import bookRouter from "./routes/bookRouter.js";
import borrowRouter from "./routes/borrowRouter.js";
import expressFileupload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import { notifyUsers } from "./services/notifyUser.js";
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js";

// Load environment variables from config.env
config({ path: "./config/config.env" });

export const app = express();

// -------------------- Middleware --------------------

// Enable CORS for frontend URL with credentials (cookies)
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Parse cookies from incoming requests
app.use(cookieParser());

// Parse JSON bodies from requests
app.use(express.json());

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// File upload middleware for avatar or book image uploads
app.use(
  expressFileupload({
    useTempFiles: true, // store temporary files in server temp directory
    tempFileDir: "/tmp/",
  })
);

// -------------------- Routes --------------------

// Authentication routes (register, login, logout, password reset)
app.use("/api/v1/auth", authRouter);
// Example: http://localhost:4000/api/v1/auth/register

// Book routes (add, get, delete books)
app.use("/api/v1/books", bookRouter);
// Example: http://localhost:4000/api/v1/books/all

// Borrow routes (record borrow, return, borrowed books)
app.use("/api/v1/borrow", borrowRouter);
// Example: http://localhost:4000/api/v1/borrow/record-borrow-book/:id

// User management routes (get all users, add admin)
app.use("/api/v1/user", userRouter);

// -------------------- Cron Jobs --------------------

// Notify users about overdue books every 30 seconds
notifyUsers();

// Remove unverified accounts after 30 minutes
removeUnverifiedAccounts();

// -------------------- Database --------------------

// Connect to MongoDB
connectDB();

// -------------------- Error Handling --------------------

// Centralized error handling middleware (must be after routes)
app.use(errorMiddleware);