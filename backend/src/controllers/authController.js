const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const generateOTP = require('../utils/generateOTP');
const { sendOTPEmail } = require('../utils/sendEmail');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return sendError(res, 'Name, email and password are required.', 400);
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return sendError(res, 'Email already registered.', 409);

    const user = await User.create({ name, email, password });

    return sendSuccess(
      res,
      { userId: user._id, name: user.name, email: user.email },
      'Account created successfully. Please log in.',
      201
    );
  } catch (err) {
    console.error('signup error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return sendError(res, messages.join('. '), 400);
    }
    return sendError(res, 'Server error during signup.', 500);
  }
};

// ── POST /api/auth/login ──────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return sendError(res, 'Email and password are required.', 400);
    }

    // Guard: MongoDB must be connected
    if (!process.env.MONGO_URI) {
      return sendError(res, 'Server misconfiguration: MONGO_URI not set.', 500);
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return sendError(res, 'Invalid email or password.', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return sendError(res, 'Invalid email or password.', 401);

    // Generate & store OTP
    const { otp, expiresAt } = generateOTP();
    await OTP.deleteMany({ email: user.email });
    await OTP.create({ email: user.email, otp, expiresAt });

    // Send OTP email — with 8s timeout so SMTP never hangs the request
    try {
      await Promise.race([
        sendOTPEmail(user.email, otp),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('SMTP timeout')), 8000)
        ),
      ]);
    } catch (mailErr) {
      // Non-fatal: OTP is saved in DB; log and continue
      console.warn('sendOTPEmail failed (non-fatal):', mailErr.message);
    }

    return sendSuccess(res, { email: user.email }, 'OTP sent to your email. Valid for 5 minutes.');
  } catch (err) {
    console.error('login error:', err);
    // Expose error detail in production for diagnosis (safe — no secrets exposed)
    return sendError(res, `Server error during login: ${err.message}`, 500);
  }
};

// ── POST /api/auth/verify-otp ─────────────────────────────────────────────────
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return sendError(res, 'Email and OTP are required.', 400);
    }

    const record = await OTP.findOne({ email: email.toLowerCase() });
    if (!record) return sendError(res, 'OTP not found or already expired.', 400);

    if (record.otp !== otp.toString()) {
      return sendError(res, 'Incorrect OTP.', 400);
    }

    if (new Date() > record.expiresAt) {
      await OTP.deleteOne({ _id: record._id });
      return sendError(res, 'OTP has expired. Please log in again.', 400);
    }

    await OTP.deleteOne({ _id: record._id });

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isVerified: true },
      { new: true }
    );

    if (!user) return sendError(res, 'User not found.', 404);

    const token = jwt.sign(
      { id: user._id, role: user.role, subscription: user.subscription },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          subscription: user.subscription,
        },
      },
      'Login successful.'
    );
  } catch (err) {
    console.error('verifyOtp error:', err);
    return sendError(res, 'Server error during OTP verification.', 500);
  }
};

module.exports = { signup, login, verifyOtp };
