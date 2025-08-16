import mongoose from "mongoose";

export const connectDB = ()=>{
    mongoose
    .connect(process.env.MONGO_URI, {
        dbName:"MERN_Stack_Lib_Management",
    }).then((data) => {
        console.log(`MongoDB connected with server`);
    }).catch((error) => {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit the process if connection fails
    });

}