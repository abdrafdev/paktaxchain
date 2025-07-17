// Test OTP Flow
// This script helps test the OTP functionality

async function testOTPFlow() {
  const testPhone = '03001234567';
  
  console.log('Testing OTP Flow...');
  
  // Test 1: Send OTP
  console.log('\n1. Sending OTP...');
  try {
    const sendResponse = await fetch('http://localhost:3000/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: testPhone
      })
    });
    
    const sendResult = await sendResponse.json();
    console.log('Send OTP Response:', sendResult);
    
    if (sendResult.otp) {
      console.log('OTP for testing:', sendResult.otp);
      
      // Test 2: Verify OTP
      console.log('\n2. Verifying OTP...');
      const verifyResponse = await fetch('http://localhost:3000/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: testPhone,
          otp: sendResult.otp
        })
      });
      
      const verifyResult = await verifyResponse.json();
      console.log('Verify OTP Response:', verifyResult);
      
      if (verifyResult.verified) {
        console.log('✅ OTP flow working correctly!');
      } else {
        console.log('❌ OTP verification failed');
      }
    } else {
      console.log('❌ OTP not returned in response');
    }
    
  } catch (error) {
    console.error('Error testing OTP flow:', error);
  }
}

// Export for use in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testOTPFlow };
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testOTPFlow();
}
