// Simple in-memory OTP storage for development
class OTPStorage {
  constructor() {
    this.storage = new Map();
  }

  // Store OTP with expiration
  set(phone, otp, expiresAt) {
    this.storage.set(phone, { otp, expiresAt });
    this.cleanup();
  }

  // Get OTP data
  get(phone) {
    const data = this.storage.get(phone);
    if (data && Date.now() > data.expiresAt) {
      this.storage.delete(phone);
      return null;
    }
    return data;
  }

  // Verify and remove OTP
  verify(phone, otp) {
    const data = this.get(phone);
    if (data && data.otp === otp) {
      this.storage.delete(phone);
      return true;
    }
    return false;
  }

  // Clean up expired OTPs
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.storage.entries()) {
      if (value.expiresAt < now) {
        this.storage.delete(key);
      }
    }
  }

  // Get all stored OTPs (for debugging)
  getAll() {
    return Array.from(this.storage.entries()).map(([phone, data]) => ({
      phone,
      otp: data.otp,
      expiresAt: data.expiresAt,
      expired: Date.now() > data.expiresAt
    }));
  }
}

// Create singleton instance
const otpStorage = new OTPStorage();

export default otpStorage;
