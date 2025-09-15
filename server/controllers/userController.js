import { catchAsyncErrors } from '../middlewares/catchAsynceErrors.js';
import ErrorHandler from '../middlewares/errorMiddlewares.js';
import { User } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from "cloudinary";

// ------------------ GET ALL VERIFIED USERS ------------------
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    // Fetch only verified users
    const users = await User.find({ accountVerified: true });

    res.status(200).json({
        success: true,
        users,
    });
});

// ------------------ REGISTER A NEW ADMIN ------------------
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
    // 1. Check if file is uploaded (avatar is mandatory for admin)
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Admin avatar is required.", 400));
    }

    // 2. Extract required fields
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill all fields", 400));
    }

    // 3. Check if admin already exists
    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
        return next(new ErrorHandler("User already registered.", 400));
    }

    // 4. Validate password length
    if (password.length < 8 || password.length > 16) {
        return next(new ErrorHandler("Password must be between 8 to 16 characters long.", 400));
    }

    // 5. Validate avatar file type
    const { avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(avatar.mimetype)) {
        return next(new ErrorHandler("File format not supported", 400));
    }

    // 6. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Upload avatar to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        { folder: "LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("Cloudinary error:", cloudinaryResponse.error || "Unknown cloudinary error");
        return next(new ErrorHandler("Failed to upload avatar image to Cloudinary", 500));
    }

    // 8. Create admin in DB
    const admin = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Admin",
        accountVerified: true, // Admins are verified by default
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    // 9. Send success response
    res.status(201).json({
        success: true,
        message: "Admin registered successfully",
        admin,
    });
});
