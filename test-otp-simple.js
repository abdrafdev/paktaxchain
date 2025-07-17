// Simple test to verify OTP functionality works
const fetch = require('node-fetch');

async function testOTP() {
  const baseUrl = 'http://localhost:3000';
  const phone = '03001234567';
  
  console.log('🧪 Testing OTP functionality...\n');
  
  try {
    // Test 1: Send OTP
    console.log('📤 Step 1: Sending OTP...');
    const sendResponse = await fetch(`${baseUrl}/api/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone })
    });
    
    if (!sendResponse.ok) {
      console.error('❌ Send OTP failed:', sendResponse.status);
      const error = await sendResponse.text();
      console.error('Error details:', error);
      return;
    }
    
    const sendData = await sendResponse.json();
    console.log('✅ Send OTP response:', sendData);
    
    const otp = sendData.otp;
    if (!otp) {
      console.error('❌ No OTP returned in response');
      return;
    }
    
    console.log(`📱 Generated OTP: ${otp}\n`);
    
    // Test 2: Verify OTP
    console.log('🔍 Step 2: Verifying OTP...');
    const verifyResponse = await fetch(`${baseUrl}/api/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, otp })
    });
    
    if (!verifyResponse.ok) {
      console.error('❌ Verify OTP failed:', verifyResponse.status);
      const error = await verifyResponse.text();
      console.error('Error details:', error);
      return;
    }
    
    const verifyData = await verifyResponse.json();
    console.log('✅ Verify OTP response:', verifyData);
    
    if (verifyData.verified) {
      console.log('\n🎉 SUCCESS: OTP system is working correctly!');
    } else {
      console.log('\n❌ FAILURE: OTP verification failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testOTP();
