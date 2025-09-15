import nodemailer from 'nodemailer';

export const sendEmail = async (toEmail, subject, message) => {
    try {
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
        console.log('Email sent successfully:', info.response);

        return info;
    } catch (error) {
        console.error('Error sending email:', error.message, error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};
