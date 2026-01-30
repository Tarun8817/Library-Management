import mongoose from 'mongoose';

// Define the schema for books
const bookSchema = new mongoose.Schema(
  {
    // Title of the book
    title: {
      type: String,       // Data type
      required: true,     // Must be provided
      trim: true,         // Remove extra spaces from start/end
    },
    // Author name
    author: {
      type: String,
      required: true,
      trim: true,
    },
    // Book description
    description: {
      type: String,
      required: true,
    },
    // Price of the book
    price: {
      type: Number,
      required: true,
    },
    // Quantity available in the library
    quantity: {
      type: Number,
      required: true,
    },
    // Availability status: true if quantity > 0
    availability: {
      type: Boolean,
      default: true, // Default value is true
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the Book model for use in controllers
export default mongoose.model('Book', bookSchema);
