import otpStorage from '../../lib/otpStorage';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const allOtps = otpStorage.getAll();
    
    res.status(200).json({
      message: 'OTP storage debug info',
      timestamp: new Date().toISOString(),
      currentTime: Date.now(),
      otps: allOtps,
      count: allOtps.length
    });
    
  } catch (error) {
    console.error('Error getting OTP debug info:', error);
    res.status(500).json({ 
      message: 'Failed to get debug info',
      error: error.message
    });
  }
}
