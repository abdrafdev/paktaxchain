// Test script to verify OTP functionality
// Run this with: node test_otp.js

const { dbHelpers } = require('./lib/supabaseClient');

async function testOTP() {
    console.log('Testing OTP functionality...\n');
    
    const testPhone = '+923001234567';
    
    try {
        // Test 1: Generate and save OTP
        console.log('1. Testing OTP generation and saving...');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        
        const savedOTP = await dbHelpers.saveOTP(testPhone, otp, expiresAt);
        console.log('✅ OTP saved successfully:', savedOTP);
        console.log('Generated OTP:', otp);
        
        // Test 2: Verify correct OTP
        console.log('\n2. Testing OTP verification with correct OTP...');
        const verifyResult = await dbHelpers.verifyOTP(testPhone, otp);
        console.log('✅ OTP verification result:', verifyResult);
        
        // Test 3: Try to verify same OTP again (should fail - already used)
        console.log('\n3. Testing OTP verification with already used OTP...');
        const verifyResult2 = await dbHelpers.verifyOTP(testPhone, otp);
        console.log('Expected false (already used):', verifyResult2);
        
        // Test 4: Try to verify wrong OTP
        console.log('\n4. Testing OTP verification with wrong OTP...');
        const verifyResult3 = await dbHelpers.verifyOTP(testPhone, '123456');
        console.log('Expected false (wrong OTP):', verifyResult3);
        
        console.log('\n✅ All OTP tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Error during OTP testing:', error.message);
        console.error('Full error:', error);
    }
}

// Run the test
testOTP();
