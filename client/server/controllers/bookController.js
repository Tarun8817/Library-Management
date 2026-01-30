import { catchAsyncErrors } from '../middlewares/catchAsynceErrors.js'; // Middleware to handle async errors
import Book from '../models/bookModel.js'; // Mongoose Book model
import ErrorHandler from '../middlewares/errorMiddlewares.js'; // Custom error handler

// ------------------ ADD A BOOK ------------------
export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity } = req.body;

  // Check if all fields are provided
  if (!title || !author || !description || !price || !quantity) {
    return next(new ErrorHandler('Please provide all required fields', 400));
  }

  // Create new book in DB
  const book = await Book.create({
    title,
    author,
    description,
    price,
    quantity,
  });

  // Respond with success
  res.status(201).json({
    success: true,
    message: 'Book added successfully',
    book,
  });
});

// ------------------ GET ALL BOOKS ------------------
export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  // Fetch all books from DB
  const books = await Book.find();

  res.status(200).json({
    success: true,
    books,
  });
});

// ------------------ DELETE A BOOK ------------------
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Find book by ID
  const book = await Book.findById(id);

  // If book not found, throw error
  if (!book) {
    return next(new ErrorHandler('Book not found', 404));
  }

  // Delete the book
  await book.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Book deleted successfully',
  });
});
