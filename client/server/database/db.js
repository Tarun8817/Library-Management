import mongoose from "mongoose";

// ------------------ CONNECT TO DATABASE ------------------
export const connectDB = () => {
    mongoose
        .connect(process.env.MONGO_URI, {
            dbName: "MERN_Stack_Lib_Management", // Database name
        })
        .then((data) => {
            console.log(`✅ MongoDB connected: ${data.connection.host}`);
        })
        .catch((error) => {
            console.error(`❌ Error connecting to MongoDB: ${error.message}`);
            process.exit(1); // Exit app if DB connection fails
        });
};
