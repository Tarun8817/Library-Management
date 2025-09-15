import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// User Schema
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30, // Limit to 30 characters
    },

    // User's email address
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // User's password
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Exclude password from queries by default
    },

    // User role: "User" or "Admin"
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"],
    },

    // Has the user verified their account
    accountVerified: {
      type: Boolean,
      default: false,
    },

    // Array of borrowed books
    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Borrow",
          required: true,
        },
        bookTitle: String, // For quick display
        borrowedDate: {
          type: Date,
          default: Date.now,
        },
        dueDate: Date, // Book due date
        returned: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // User avatar stored in Cloudinary
    avatar: {
      public_id: String,
      url: String,
    },

    // OTP verification code and its expiry
    verificationCode: Number,
    verificationCodeExpire: Date,

    // Reset password token and expiry
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Method to generate OTP verification code
userSchema.methods.generateVerificationCode = async function () {
  function generateRandomFiveDigitNumber() {
    const firstDigit = Math.floor(Math.random() * 9) + 1; // First digit not zero
    const remainingDigits = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 10)
    );
    return parseInt([firstDigit, ...remainingDigits].join(""), 10);
  }

  const verificationCode = generateRandomFiveDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes
  return verificationCode;
};

// Method to generate JWT token for authentication
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE } // e.g., "7d"
  );
};

// Method to generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Token valid for 15 minutes
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

// Export User model
export const User = mongoose.model("User", userSchema);
