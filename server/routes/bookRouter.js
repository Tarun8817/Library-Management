import express from 'express';
import { isAuthenticated, isAuthorized } from '../middlewares/authMiddleware.js';
import { addBook, deleteBook, getAllBooks } from '../controllers/bookController.js';

const router = express.Router();

// Add a new book (Admin only)
router.post('/admin/add', isAuthenticated, isAuthorized("Admin"), addBook);

// Get all books (Authenticated users)
router.get('/all', isAuthenticated, getAllBooks);

// Delete a book (Admin only)
router.delete('/delete/:id', isAuthenticated, isAuthorized("Admin"), deleteBook);

export default router;
