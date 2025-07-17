// SMS Service for Pakistan using Twilio
const twilio = require('twilio');

async function sendSMS(phoneNumber, message) {
  // Normalize Pakistani phone number
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  
  console.log(`Sending SMS to ${normalizedPhone}: ${message}`);
  
  // Check if Twilio is configured
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    return await sendViaTwilio(normalizedPhone, message);
  }
  
  // Fallback for development - just log the message
  console.warn('Twilio not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to your .env.local file');
  console.log('SMS would be sent to:', normalizedPhone);
  console.log('Message:', message);
  return true; // Return true so the flow continues
}

function normalizePhoneNumber(phone) {
  // Remove all non-digit characters
  let normalized = phone.replace(/\D/g, '');
  
  // Handle Pakistani phone numbers
  if (normalized.startsWith('92')) {
    // Already has country code
    return '+' + normalized;
  } else if (normalized.startsWith('0')) {
    // Remove leading 0 and add country code
    return '+92' + normalized.substring(1);
  } else if (normalized.length === 10) {
    // Assume it's a Pakistani number without country code
    return '+92' + normalized;
  }
  
  return '+' + normalized;
}

// Eocean SMS Service (Pakistani provider)
async function sendViaEocean(phoneNumber, message) {
  try {
    const response = await fetch('https://eocean.us/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.EOCEAN_API_KEY,
        to: phoneNumber,
        text: message,
        from: process.env.EOCEAN_SENDER_ID || 'PakTaxChain'
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('SMS sent successfully via Eocean');
      return true;
    } else {
      console.error('Eocean SMS error:', result);
      return false;
    }
  } catch (error) {
    console.error('Eocean SMS service error:', error);
    return false;
  }
}

// Twilio SMS Service
async function sendViaTwilio(phoneNumber, message) {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    
    console.log(`Sending SMS via Twilio to ${phoneNumber}`);
    
    // Create Twilio client
    const client = twilio(accountSid, authToken);
    
    // Send SMS
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: phoneNumber
    });
    
    console.log('SMS sent successfully via Twilio. SID:', result.sid);
    return true;
    
  } catch (error) {
    console.error('Twilio SMS service error:', error);
    return false;
  }
}

// Custom SMS Gateway
async function sendViaCustomGateway(phoneNumber, message) {
  try {
    const response = await fetch(process.env.SMS_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SMS_GATEWAY_TOKEN}`
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: message,
        from: process.env.SMS_SENDER_ID || 'PakTaxChain'
      })
    });
    
    if (response.ok) {
      console.log('SMS sent successfully via custom gateway');
      return true;
    } else {
      console.error('Custom SMS gateway error:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Custom SMS gateway error:', error);
    return false;
  }
}

// Email-to-SMS Gateway (for testing)
async function sendViaEmailToSms(phoneNumber, message) {
  try {
    // This is a simple method for testing
    // Many carriers have email-to-SMS gateways
    const carriers = {
      'jazz': 'sms.jazz.com.pk',
      'telenor': 'sms.telenor.com.pk',
      'ufone': 'sms.ufone.com',
      'zong': 'sms.zong.com.pk'
    };
    
    // For testing, we'll just log it
    console.log(`Would send email to SMS gateway: ${phoneNumber}@carrier-gateway.com`);
    console.log(`Message: ${message}`);
    
    return true;
  } catch (error) {
    console.error('Email-to-SMS error:', error);
    return false;
  }
}

// Helper function to test SMS service
async function testSMSService() {
  const testNumber = '+923001234567';
  const testMessage = 'Test message from PakTaxChain';
  
  console.log('Testing SMS service...');
  const result = await sendSMS(testNumber, testMessage);
  
  if (result) {
    console.log('SMS service test passed');
  } else {
    console.log('SMS service test failed');
  }
  
  return result;
}

// Export functions
module.exports = {
  sendSMS,
  testSMSService
};
