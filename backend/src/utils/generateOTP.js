/**
 * Generate a 6-digit numeric OTP with a 5-minute expiry
 */
const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  return { otp, expiresAt };
};

module.exports = generateOTP;
