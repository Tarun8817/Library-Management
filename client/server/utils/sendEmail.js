import nodemailer from 'nodemailer';

export const sendEmail = async (toEmail, subject, message) => {
    try {
        // Validate required parameters
        if (!toEmail) {
            throw new Error('No recipients defined - toEmail is required');
        }
        if (!subject) {
            throw new Error('Subject is required');
        }
        if (!message) {
            throw new Error('Message content is required');
        }

        // Validate environment variables
        if (!process.env.EMAIL_MAIL || !process.env.EMAIL_PASS) {
            throw new Error('Email configuration missing - check EMAIL_MAIL and EMAIL_PASS environment variables');
        }
        // Create a transporter object using SMTP settings
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 465,
            service: process.env.SMTP_SERVICE || 'gmail',
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_MAIL, // your email
                pass: process.env.EMAIL_PASS, // your email password or app-specific password
            },
        });

        // Mail options
        const mailOptions = {
            from: process.env.EMAIL_MAIL, // sender address
            to: toEmail,                  // recipient address
            subject,                      // email subject
            html: message,                // email body in HTML
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', toEmail);

        return info;
    } catch (error) {
        console.error('Error sending email:', error.message, error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};
