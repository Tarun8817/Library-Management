import dotenv from 'dotenv';
import { sendEmail } from './utils/sendEmail.js';

// Load environment variables
dotenv.config({ path: './config/config.env' });

async function testEmail() {
    try {
        console.log('Testing email configuration...');
        console.log('EMAIL_MAIL:', process.env.EMAIL_MAIL);
        console.log('SMTP_HOST:', process.env.SMTP_HOST);
        
        await sendEmail(
            process.env.EMAIL_MAIL, // Send to yourself for testing
            'Test Email - Library Management System',
            '<h1>Test Email</h1><p>If you receive this email, your email configuration is working correctly!</p>'
        );
        
        console.log('✅ Email test successful!');
    } catch (error) {
        console.error('❌ Email test failed:', error.message);
    }
}

testEmail();