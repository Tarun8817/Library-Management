import { catchAsyncErrors } from "../middlewares/catchAsynceErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "node:crypto"; // ✅ fixed import

export const register = catchAsyncErrors(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return next(new ErrorHandler("Please enter all fields,", 400));
        }
        const isRegistered = await User.findOne({ email, accountVerified: true });
        if (isRegistered) {
            return next(new ErrorHandler("User already registered", 400));
        }
        const rigisterationAttemptsByUser = await User.find({
            email,
            accountVerified: false
        });
        if (rigisterationAttemptsByUser.length >= 5) {
            return next(new ErrorHandler("You have exceeded the maximum number of registration attempts. Please try again later.", 429));
        }
        if (password.length < 8 || password.length > 20) {
            return next(new ErrorHandler("Password must be at least 6 characters long", 400));
        }
        const handedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: handedPassword
        });
        const verificationCode = await user.generateVerificationCode();
        await user.save();
        sendVerificationCode(verificationCode, email, res);

    } catch (error) {
        next(error);
    }
});


export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    try {
        const userAllEntries = await User.find({
            email,
            accountVerified: false,
        }).sort({ createdAt: -1 });

        if (!userAllEntries || userAllEntries.length === 0) {
            return next(new ErrorHandler("User not found or already verified", 404));
        }

        let user = userAllEntries[0]; // most recent entry

        // Clean up duplicate unverified entries
        if (userAllEntries.length > 1) {
            await User.deleteMany({
                _id: { $ne: user._id },
                email,
                accountVerified: false,
            });
        }

        if (!user.verificationCode || user.verificationCode !== Number(otp)) {
            return next(new ErrorHandler("Invalid OTP", 400));
        }

        const currentTime = Date.now();
        const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();

        if (currentTime > verificationCodeExpire) {
            return next(new ErrorHandler("OTP has expired", 400));
        }

        user.accountVerified = true;
        user.verificationCode = undefined;
        user.verificationCodeExpire = undefined;
        await user.save({ validateModifiedOnly: true });

        sendToken(user, 200, "Account verified successfully", res);

    } catch (error) {
        return next(new ErrorHandler("Internal server error", 500));
    }
});

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    const user = await User.findOne({ email, accountVerified: true }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid email or Password", 400));
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or Password", 400));
    }

    sendToken(user, 200, "Login successful", res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "Logged out successfully",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler("Email is required", 400));
    }

    const user = await User.findOne({
        email,
        accountVerified: true
    });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

    try {
        await sendEmail(user.email, "Library Management System - Password Reset", message);

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

export const resetPassword = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(
            new ErrorHandler(
                "Reset password token is invalid or has expired",
                400
            )
        );
    }
    if(req.body.password !== req.body.confirmPassword) {
        return next(
            new ErrorHandler("Passwords do not match", 400)
        );
    }
    if(req.body.password.length < 8 ||
        req.body.password.length > 16 ||
        req.body.confirmPassword.length < 8 ||
        req.body.confirmPassword.length > 16) {
        return next(new ErrorHandler("Password must between 8 and 16 characters long", 400));
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendToken(user, 200, "Password reset successfully", res);
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");
    const { currentPassword,newPassword,confirmNewPassword} = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Current password is incorrect", 400));
    }
    if (newPassword.length <  8 || 
        newPassword.length >16 || 
        confirmNewPassword.length<8 || 
        confirmNewPassword.length>16) {
        return next(new ErrorHandler("New password and confirm password do not match", 400));
    }
    if (newPassword !== confirmNewPassword) {
        return next(new ErrorHandler("New password and confirm password do not match", 400));
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    sendToken(user, 200, "Password updated successfully", res);

})