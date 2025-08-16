import { catchAsyncErrors } from "./catchAsynceErrors.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./errorMiddlewares.js";
import { User } from "../models/userModel.js";
export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const{token}= req.cookies;
    if (!token) {
        return next(new ErrorHandler("User is not authenticated", 400));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded Data:", decodedData);
    req.user = await User.findById(decodedData.id);
    next();
});

export const isAuthorized = (...roles)=>{
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: (${req.user.role}) is not allowed to access this resource`, 403));
        }
        next();
    };
}