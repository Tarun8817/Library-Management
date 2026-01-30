import express from "express";
import {
    borrowedBooks,
    getBorrowedBooksForAdmin,
    recordBorrowedBook,
    returnBorrowBook
} from '../controllers/borrowController.js';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware.js';

const router = express.Router();

// ----------------------------------------
// BORROW MANAGEMENT ROUTES
// ----------------------------------------

// Record a borrowed book for a user
// Endpoint: POST /record-borrow-book/:id
// Params: id - Book ID
// Access: Admin only
// Body: { email } - user's email
// Creates a borrow record and updates book availability
router.post("/record-borrow-book/:id",
    isAuthenticated,
    isAuthorized("Admin"),
    recordBorrowedBook
);

// Get all borrowed books (for Admin)
// Endpoint: GET /borrowed-books-by-users
// Access: Admin only
// Returns a list of all borrowed books across users
router.get("/borrowed-books-by-users",
    isAuthenticated,
    isAuthorized("Admin"),
    getBorrowedBooksForAdmin
);

// Get borrowed books for logged-in user
// Endpoint: GET /my-borrowed-books
// Access: Authenticated users
// Returns a list of books currently borrowed by the user
router.get("/my-borrowed-books",
    isAuthenticated,
    borrowedBooks
);

// Return a borrowed book
// Endpoint: PUT /return-borrowed-book/:bookId
// Params: bookId - Book ID
// Access: Admin only
// Updates the borrow record, calculates fine, and updates book quantity
router.put("/return-borrowed-book/:bookId",
    isAuthenticated,
    isAuthorized("Admin"),
    returnBorrowBook
);

export default router;
