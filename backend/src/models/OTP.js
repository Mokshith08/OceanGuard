const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL: auto-delete the document at expiresAt
  },
});

module.exports = mongoose.model('OTP', otpSchema);
