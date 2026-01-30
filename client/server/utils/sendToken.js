export const sendToken = (user, statusCode, message, res) => {
    // Generate JWT token using the method defined in the user model
    const token = user.generateToken();

    // Set the token as a HTTP-only cookie
    res.status(statusCode).cookie("token", token, {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ), // Convert days to milliseconds
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
        sameSite: "strict", // Protects against CSRF
    }).json({
        success: true,
        user,      // Send user data (careful not to include sensitive info like password)
        message,   // Custom success message
        token,     // Also send the token in response body (optional)
    });
};
