import { sendEmail } from "./sendEmail.js";
import { generateVerificationOtpEmailTemplate } from "../utils/emailTemplates.js";

export async function sendVerificationCode(verificationCode, email, res) {
    try {
        // Generate email HTML content using the OTP
        const message = generateVerificationOtpEmailTemplate(verificationCode);

        // Send the email
        await sendEmail(
            email,
            "Library Management System - Verification Code",
            message
        );

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "Verification code sent successfully",
        });

    } catch (error) {
        // Log detailed error for debugging
        console.error("Error sending verification code:", error);

        // Respond with a generic failure message
        return res.status(500).json({
            success: false,
            message: "Failed to send verification code. Please try again later.",
        });
    }
}
