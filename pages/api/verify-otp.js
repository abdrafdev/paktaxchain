import otpStorage from '../../lib/otpStorage';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  try {
    // Try to verify using shared storage
    const isValid = otpStorage.verify(phone, otp);
    
    if (isValid) {
      return res.status(200).json({ 
        message: 'OTP verified successfully',
        verified: true
      });
    }
    
    // Fallback: Accept any 6-digit OTP in development mode
    if (process.env.NODE_ENV === 'development') {
      if (otp.length === 6 && /^\d{6}$/.test(otp)) {
        console.log(`Development fallback: Accepting OTP ${otp} for ${phone}`);
        return res.status(200).json({ 
          message: 'OTP verified successfully (development fallback)',
          verified: true,
          devMode: true
        });
      }
    }
    
    return res.status(400).json({ message: 'Invalid or expired OTP' });
    
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ 
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
}
