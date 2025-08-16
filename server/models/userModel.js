import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        trim: true,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false // Exclude password from queries by default
    },
    role: {
        type: String,
        default: "User",
        enum: ["User", "Admin"]
    },
    accountVerified:{
        type: Boolean,
        default: false  
    },
    borrowedBooks:[
        {
            bookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Borrow',
                required: true
            },
            borrowedDate: {
                type: Date,
                default: Date.now
            },
            returned: {
                type: Boolean,
                default: false,
            },
            bookTitle:String,
            borrowedDate:Date,
            dueDate:Date,
        },
    ],
    avatar:{
        public_id:String,
        url: String,
    },
    verificationCode:Number,
    verificationCodeExpire:Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true

});

userSchema.methods.generateVerificationCode = async function() {
    function geenerateRandomFiveDigitNumber() {
        const firstDigit = Math.floor(Math.random() * 9) + 1; // Ensure first digit is not zero
        const remainingDigits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
        return parseInt([firstDigit, ...remainingDigits].join(''), 10);
    }
    const verificationCode = geenerateRandomFiveDigitNumber();
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // Code valid for 10 minutes
    return verificationCode;
}

userSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id }, 
        process.env.JWT_SECRET_KEY, 
        { expiresIn: process.env.JWT_EXPIRE} // e.g., "7d"
    );
};

userSchema.methods.getResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // Token valid for 10 minutes
    
    return resetToken;

}

export const User = mongoose.model("User", userSchema);