import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDB } from './database/db.js';
import { errorMiddleware } from './middlewares/errorMiddlewares.js';
import authRouter from './routes/authRouter.js';
import bookRouter from './routes/bookRouter.js';
import borrowRouter from './routes/borrowRouter.js'
import expressFileupload from 'express-fileupload'
config({ path: './config/config.env' });

export const app = express();

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressFileupload({
    useTempFiles: true, 
    tempFileDir: "/tmp/"
}));


// Routes
app.use('/api/v1/auth', authRouter);
//http://localhost:4000/api/v1/auth/register

app.use('/api/v1/books', bookRouter);
//http://localhost:4000/api/v1/books/all

app.use("/api/v1/borrow",borrowRouter);
//httpd://localhost:4000/api/v1/


// Error Middleware (must be after routes)
app.use(errorMiddleware);

// Database connection
connectDB();
