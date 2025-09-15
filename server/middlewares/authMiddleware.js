import { catchAsyncErrors } from "./catchAsynceErrors.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./errorMiddlewares.js";
import { User } from "../models/userModel.js";

// ------------------- AUTHENTICATION -------------------
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies; // ✅ JWT stored in cookies

    // If no token → user not logged in
    if (!token) {
        return next(new ErrorHandler("User is not authenticated", 401));
    }

    try {
        // Verify JWT using secret key
        const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

        console.log("✅ Decoded Data:", decodedData);

        // Attach user object to request for future use
        req.user = await User.findById(decodedData.id);

        if (!req.user) {
            return next(new ErrorHandler("User does not exist", 404));
        }

        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token", 401));
    }
});

// ------------------- AUTHORIZATION -------------------
export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        // Check if logged-in user's role matches the required roles
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(
                    `Role: (${req.user.role}) is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};
