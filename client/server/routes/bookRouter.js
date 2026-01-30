import express from 'express';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware.js';
import { addBook, deleteBook, getAllBooks } from '../controllers/bookController.js';

const router = express.Router();

// ----------------------------------------
// BOOK MANAGEMENT ROUTES
// ----------------------------------------

// Add a new book
// Endpoint: POST /admin/add
// Access: Admin only
// Body: { title, author, description, price, quantity }
// Requires authentication and admin role
router.post('/admin/add', isAuthenticated, isAuthorized("Admin"), addBook);

// Get all books
// Endpoint: GET /all
// Access: Authenticated users
// Returns a list of all books in the database
router.get('/all', isAuthenticated, getAllBooks);

// Delete a book
// Endpoint: DELETE /delete/:id
// Access: Admin only
// Params: id - Book ID to delete
// Requires authentication and admin role
router.delete('/delete/:id', isAuthenticated, isAuthorized("Admin"), deleteBook);

export default router;
