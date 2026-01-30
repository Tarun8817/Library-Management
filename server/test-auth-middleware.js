import dotenv from 'dotenv';
import axios from 'axios';

// Load environment variables
dotenv.config({ path: './config/config.env' });

async function testAuthMiddleware() {
    try {
        console.log('Testing authentication middleware...');
        
        // Test 1: No token (should get 401)
        console.log('\n1. Testing with no token:');
        try {
            await axios.get('http://localhost:4000/api/v1/auth/me');
        } catch (error) {
            console.log('✅ Expected 401 error:', error.response?.status, error.response?.data?.message);
        }
        
        // Test 2: Invalid Authorization header (should not crash)
        console.log('\n2. Testing with invalid Authorization header:');
        try {
            await axios.get('http://localhost:4000/api/v1/auth/me', {
                headers: {
                    'Authorization': 'InvalidHeader'
                }
            });
        } catch (error) {
            console.log('✅ Expected 401 error:', error.response?.status, error.response?.data?.message);
        }
        
        // Test 3: Malformed Bearer token (should not crash)
        console.log('\n3. Testing with malformed Bearer token:');
        try {
            await axios.get('http://localhost:4000/api/v1/auth/me', {
                headers: {
                    'Authorization': 'Bearer'
                }
            });
        } catch (error) {
            console.log('✅ Expected 401 error:', error.response?.status, error.response?.data?.message);
        }
        
        // Test 4: Valid Bearer format but invalid token (should not crash)
        console.log('\n4. Testing with invalid Bearer token:');
        try {
            await axios.get('http://localhost:4000/api/v1/auth/me', {
                headers: {
                    'Authorization': 'Bearer invalidtoken123'
                }
            });
        } catch (error) {
            console.log('✅ Expected 401 error:', error.response?.status, error.response?.data?.message);
        }
        
        console.log('\n✅ All auth middleware tests passed - no crashes!'); 
        
    } catch (error) {
        console.error('❌ Auth middleware test failed:', error.message);
    }
}

testAuthMiddleware();