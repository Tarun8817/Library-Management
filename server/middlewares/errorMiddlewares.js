// Custom Error class extending the built-in Error
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message); // Call parent constructor
        this.statusCode = statusCode; // Store HTTP status code
    }
}

// Express error-handling middleware
export const errorMiddleware = (err, req, res, next) => {
    // Default message and status code if not provided
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    console.log(err); // Log the error for debugging

    // Handle specific MongoDB duplicate key error
    if (err.code === 11000) {
        const statusCode = 400;
        const message = `Duplicate field value entered`;
        err = new ErrorHandler(message, statusCode);
    }

    // Handle invalid JWT
    if (err.name === 'JsonWebTokenError') {
        const statusCode = 400;
        const message = `JSON Web Token is invalid, try again`;
        err = new ErrorHandler(message, statusCode);
    }

    // Handle expired JWT
    if (err.name === 'TokenExpiredError') {
        const statusCode = 400;
        const message = `JSON Web Token is expired, try again`;
        err = new ErrorHandler(message, statusCode);
    }

    // Handle Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        const statusCode = 400;
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, statusCode);
    }

    // Aggregate Mongoose validation errors, if any
    const errorMessage = err.errors
        ? Object.values(err.errors)
            .map(error => error.message)
            .join(', ')
        : err.message;

    // Send JSON response with success=false and the error message
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage
    });
};

export default ErrorHandler;
