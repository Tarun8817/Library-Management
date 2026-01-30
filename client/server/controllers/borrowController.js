import { catchAsyncErrors } from '../middlewares/catchAsynceErrors.js';
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from '../models/borrowModel.js';
import { User } from '../models/userModel.js';
import Book from '../models/bookModel.js';
import { calculatefine } from '../utils/fineCalculator.js';

// ------------------ RECORD BORROWED BOOK ------------------
export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;   // Book ID from URL
    const { email } = req.body;  // User email from request body

    // 1. Find the book
    const book = await Book.findById(id);
    if (!book) return next(new ErrorHandler("Book not found", 404));

    // 2. Find the user
    const user = await User.findOne({ email });
    if (!user) return next(new ErrorHandler("User not found", 404));

    // 3. Check if book is available
    if (book.quantity === 0) {
        return next(new ErrorHandler("Book not available", 400));
    }

    // 4. Prevent borrowing the same book twice without returning
    const isAlreadyBorrowed = user.borrowedBooks.find(
        b => b.bookId.toString() === id && b.returned === false
    );
    if (isAlreadyBorrowed) {
        return next(new ErrorHandler("Book already borrowed", 400));
    }

    // 5. Reduce book quantity & update availability
    book.quantity -= 1;
    book.availability = book.quantity > 0;
    await book.save();

    // 6. Add book entry to user's borrowed list
    user.borrowedBooks.push({
        bookId: book._id,
        bookTitle: book.title,
        borrowedDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    await user.save();

    // 7. Create a borrow record in Borrow collection
    await Borrow.create({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
        book: book._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        price: book.price,
    });

    // 8. Respond success
    res.status(200).json({
        success: true,
        message: "Borrowed book recorded successfully",
    });
});

// ------------------ RETURN BORROWED BOOK ------------------
export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;         // User email
    const { bookId } = req.params;      // Book ID

    // 1. Find book
    const book = await Book.findById(bookId);
    if (!book) return next(new ErrorHandler("Book not found", 404));

    // 2. Find verified user
    const user = await User.findOne({ email, accountVerified: true });
    if (!user) return next(new ErrorHandler("User not found", 404));

    // 3. Check if user has borrowed this book
    const borrowedBook = user.borrowedBooks.find(
        (b) => b.bookId.toString() === bookId && b.returned === false
    );
    if (!borrowedBook) {
        return next(new ErrorHandler("You have not borrowed this book", 400));
    }

    // 4. Mark book as returned in user's record
    borrowedBook.returned = true;
    await user.save();

    // 5. Increase book quantity back
    book.quantity += 1;
    book.availability = book.quantity > 0;
    await book.save();

    // 6. Update borrow record in Borrow collection
    const borrow = await Borrow.findOne({
        book: bookId,
        "user.email": email,
        returnDate: null,
    });
    if (!borrow) {
        return next(new ErrorHandler("You have not borrowed this book", 400));
    }

    borrow.returnDate = new Date();

    // 7. Calculate fine if overdue
    const fine = calculatefine(borrow.dueDate);
    borrow.fine = fine;
    await borrow.save();

    // 8. Respond with charges
    res.status(200).json({
        success: true,
        message:
            fine !== 0
                ? `The book has been returned successfully. The total charges, including a fine, are $${fine + book.price}.`
                : `The book has been returned successfully. The total charges are $${book.price}.`,
    });
});

// ------------------ GET BORROWED BOOKS FOR A USER ------------------
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
    // Borrowed books are already stored inside req.user
    const { BorrowedBooks } = req.user;

    res.status(200).json({
        success: true,
        borrowedBooks: BorrowedBooks,
    });
});

// ------------------ GET ALL BORROWED BOOKS (ADMIN) ------------------
export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
    // Fetch all borrow records
    const borrowedBooks = await Borrow.find();

    res.status(200).json({
        success: true,
        borrowedBooks,
    });
});
