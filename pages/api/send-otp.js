import otpStorage from '../../lib/otpStorage';
const { sendSMS } = require('../../lib/smsService');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Store OTP using shared storage
    otpStorage.set(phone, otp, expiresAt);

    // Log OTP for development
    console.log(`OTP for ${phone}: ${otp}`);

    // Send SMS
    try {
      const smsMessage = `Your PakTaxChain OTP is: ${otp}. Valid for 15 minutes. Don't share this code with anyone.`;
      await sendSMS(phone, smsMessage);
      console.log('SMS sent successfully');
    } catch (smsError) {
      console.error('SMS sending failed:', smsError);
      // Continue with the request even if SMS fails
    }

    res.status(200).json({ 
      message: 'OTP sent successfully',
      // Only return OTP in development mode for testing
      ...(process.env.NODE_ENV === 'development' && { otp }),
      expiresIn: '15 minutes'
    });
    
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ 
      message: 'Failed to send OTP',
      error: error.message
    });
  }
}
