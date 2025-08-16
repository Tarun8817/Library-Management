import nodemailer from 'nodemailer';

export const sendEmail = async (toEmail, subject, message) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 465,
            service: process.env.SMTP_SERVICE || 'gmail',
            secure: true, // required for port 465
            auth: {
                user: process.env.EMAIL_MAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_MAIL,
            to: toEmail,
            subject,
            html: message,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error.message, error);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};
