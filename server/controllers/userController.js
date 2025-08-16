import {catchAsyncErrors} from '../middlewares/catchAsynceErrors.js'
import ErrorHandler from '../middlewares/errorMiddlewares.js'
import {User} from '../models/userModel.js'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from "cloudinary"
export const getAllUsers = catchAsyncErrors(async(req,res,next)=>{
    const users = await  User.find({accountVerified:ture});
    res.status(200).json({
        success:true,
        users,
    });
});


export const registerNewAdmin = catchAsyncErrors(async(req,res,next)=>{
    req.body
    if(!req.files || Object.keys(req.files).length===0){
        return next(new ErrorHandler("Admin avatar is required.",400))
    }

    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return next(new ErrorHandler("please fill all fields",400));
    }
    const isRegistered = await User.findOne({email,accountVerified:true})
    if(isRegistered){
        return next(new ErrorHandler("User already registered.",400));
    }
    if(password.length < 8 || password.length >16){
        return next(new ErrorHandler("Password must be between 8 to 16 characters long.",400));
    }

    const {avatar} = req.files;
    const allowedFormats = ["image/png", "image.jpeg","image/webp"]
    if(!allowedFormats.includes(avatar.mimetype)){
        return next(new ErrorHandler("File format not supported",400));
    }
    const hashedPassword = await bcrypt.hash(password,10);

    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,{
            folder:"LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS"
        }
    );
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary error:",cloudinaryResponse.error || "Unknown cloudinary error")
    }
});