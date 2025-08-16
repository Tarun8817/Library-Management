import  {sendEmail}  from "./sendEmail.js";
import { generateVerificationOtpEmailTemplate } from "../utils/emailTemplates.js";

export async function sendVerificationCode(verificationCode, email, res) {
    try {
        const message = generateVerificationOtpEmailTemplate(verificationCode);

        
        await sendEmail(
            email,
            "Library Management System - Verification Code",
            message
        );

        return res.status(200).json({
            success: true,
            message: "Verification code sent successfully"
        });

    } catch (error) {
        console.error("Error sending verification code:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to send verification code"
        });
    }
}
