// ------------------ Imports ------------------
import { catchAsyncErrors } from "../middlewares/catchAsynceErrors.js"; // Utility to wrap async functions and catch errors
import ErrorHandler from "../middlewares/errorMiddlewares.js"; // Custom error handler class
import { User } from "../models/userModel.js"; // Mongoose User model
import bcrypt from "bcrypt"; // For password hashing and comparison
import { sendVerificationCode } from "../utils/sendVerificationCode.js"; // Utility to send OTP
import { sendToken } from "../utils/sendToken.js"; // Utility to create JWT and send as cookie
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js"; // Forgot password email template
import { sendEmail } from "../utils/sendEmail.js"; // Utility to send emails
import crypto from "node:crypto"; // ✅ Built-in Node crypto module for secure tokens

// ------------------ REGISTER ------------------
export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return next(new ErrorHandler("Please enter all fields", 400));
        }

        // Check if already registered with verified account
        const isRegistered = await User.findOne({ email, accountVerified: true });
        if (isRegistered) {
            return next(new ErrorHandler("User already registered", 400));
        }

        // Limit registration attempts for the same email
        const rigisterationAttemptsByUser = await User.find({
            email,
            accountVerified: false
        });
        if (rigisterationAttemptsByUser.length >= 5) {
            return next(new ErrorHandler("Too many registration attempts. Try again later.", 429));
        }

        // Validate password length
        if (password.length < 8 || password.length > 20) {
            return next(new ErrorHandler("Password must be between 8 and 20 characters long", 400));
        }

        // Hash password before saving
        const handedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: handedPassword
        });

        // Generate OTP for verification
        const verificationCode = await user.generateVerificationCode();
        await user.save();

        // Send OTP to user email
        sendVerificationCode(verificationCode, email, res);

    } catch (error) {
        next(error);
    }
});

// ------------------ VERIFY OTP ------------------
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    try {
        // Find latest unverified entry for given email
        const userAllEntries = await User.find({
            email,
            accountVerified: false,
        }).sort({ createdAt: -1 });

        if (!userAllEntries || userAllEntries.length === 0) {
            return next(new ErrorHandler("User not found or already verified", 404));
        }

        let user = userAllEntries[0]; // Most recent entry

        // Remove duplicate unverified entries
        if (userAllEntries.length > 1) {
            await User.deleteMany({
                _id: { $ne: user._id },
                email,
                accountVerified: false,
            });
        }

        // Check OTP validity
        if (!user.verificationCode || user.verificationCode !== Number(otp)) {
            return next(new ErrorHandler("Invalid OTP", 400));
        }

        // Check OTP expiry
        const currentTime = Date.now();
        const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();

        if (currentTime > verificationCodeExpire) {
            return next(new ErrorHandler("OTP has expired", 400));
        }

        // Mark account as verified
        user.accountVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpire = undefined;
        await user.save({ validateModifiedOnly: true });

        // Send JWT token
        sendToken(user, 200, "Account verified successfully", res);

    } catch (error) {
        return next(new ErrorHandler("Internal server error", 500));
    }
});

// ------------------ LOGIN ------------------
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    // Find verified user by email
    const user = await User.findOne({ email, accountVerified: true }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    // Match password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    sendToken(user, 200, "Login successful", res);
});

// ------------------ LOGOUT ------------------
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "Logged out successfully",
    });
});

// ------------------ GET USER ------------------
export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = req.user; // User is set from auth middleware
    res.status(200).json({
        success: true,
        user,
    });
});

// ------------------ FORGOT PASSWORD ------------------
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler("Email is required", 400));
    }

    // Find verified user
    const user = await User.findOne({
        email,
        accountVerified: true
    });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset password URL
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

    try {
        await sendEmail(user.email, "Library Management System - Password Reset", message);

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        // Reset token fields if email fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

// ------------------ RESET PASSWORD ------------------
export const resetPassword = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.params;

    // Hash token to compare with DB
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has expired", 400));
    }

    // Check if passwords match
    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    // Validate password length
    if(req.body.password.length < 8 || req.body.password.length > 16) {
        return next(new ErrorHandler("Password must be between 8 and 16 characters long", 400));
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, "Password reset successfully", res);
});

// ------------------ UPDATE PASSWORD ------------------
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Check all fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    // Match old password
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Current password is incorrect", 400));
    }

    // Validate new password length
    if (newPassword.length < 8 || newPassword.length > 16) {
        return next(new ErrorHandler("Password must be between 8 and 16 characters long", 400));
    }

    // Check new password == confirm password
    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("New password and confirm password do not match", 400));
    }

    // Hash and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    sendToken(user, 200, "Password updated successfully", res);
});
