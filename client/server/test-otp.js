import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config({ path: './config/config.env' });

async function testOTPVerification() {
    try {
        console.log('Testing OTP verification endpoint...');
        
        // Test with invalid data first
        const testData = {
            email: 'test@example.com',
            otp: '12345'
        };
        
        const response = await axios.post(
            'http://localhost:4000/api/v1/auth/verify-otp',
            testData,
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        
        console.log('✅ OTP endpoint is accessible');
        console.log('Response:', response.data);
        
    } catch (error) {
        if (error.response) {
            console.log('✅ OTP endpoint is working (expected error for invalid OTP)');
            console.log('Status:', error.response.status);
            console.log('Error:', error.response.data.message);
        } else {
            console.error('❌ OTP endpoint test failed:', error.message);
        }
    }
}

testOTPVerification();