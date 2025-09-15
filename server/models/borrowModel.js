import mongoose from 'mongoose';

// Schema for recording borrowed books
const borrowSchema = new mongoose.Schema(
  {
    // Information about the user who borrowed the book
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true,
      },
      name: {
        type: String,
        required: true, // User name required for quick reference
      },
      email: {
        type: String,
        required: true, // User email required
      },
    },

    // Price of the borrowed book at the time of borrowing
    price: {
      type: Number,
      required: true,
    },

    // Reference to the borrowed book
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book', // References Book model
      required: true,
    },

    // Date when the book was borrowed
    borrowDate: {
      type: Date,
      default: Date.now, // Defaults to current date
    },

    // Due date for returning the book
    dueDate: {
      type: Date,
      required: true,
    },

    // Date when the book was returned
    returnDate: {
      type: Date,
      default: null, // Null until the book is returned
    },

    // Fine for late return
    fine: {
      type: Number,
      default: 0, // Default is 0
    },

    // If the user has been notified for overdue book
    notified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Export the Borrow model for use in controllers
export const Borrow = mongoose.model('Borrow', borrowSchema);
