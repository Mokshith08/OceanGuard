const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const generateOTP = require('../utils/generateOTP');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/sendEmail');
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

    // Send OTP email — fail loudly so user knows exactly what's wrong
    try {
      await Promise.race([
        sendOTPEmail(user.email, otp),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email timed out. Check your spam folder or try again.')), 10000)
        ),
      ]);
    } catch (mailErr) {
      console.error('sendOTPEmail failed:', mailErr.message);
      // OTP is saved in DB — user can retry login
      return sendError(
        res,
        `Failed to send OTP email: ${mailErr.message}. Please check your email address or try again.`,
        500
      );
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

// ── POST /api/auth/forgot-password ────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, 'Email is required.', 400);

    const user = await User.findOne({ email: email.toLowerCase() });
    // Always respond with success to prevent email enumeration
    if (!user) {
      return sendSuccess(res, {}, 'If that email exists, a reset link has been sent.');
    }

    // Generate a secure random token (valid 1 hour)
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    const frontendUrl = process.env.FRONTEND_URL || 'https://oceanguardsys.vercel.app';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (mailErr) {
      console.error('Failed to send reset email:', mailErr.message);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save({ validateBeforeSave: false });
      return sendError(res, 'Failed to send reset email. Please try again.', 500);
    }

    return sendSuccess(res, {}, 'Password reset link sent to your email.');
  } catch (err) {
    console.error('forgotPassword error:', err);
    return sendError(res, 'Server error.', 500);
  }
};

// ── POST /api/auth/reset-password ─────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return sendError(res, 'Token and new password are required.', 400);
    if (password.length < 8) return sendError(res, 'Password must be at least 8 characters.', 400);

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // not expired
    });

    if (!user) return sendError(res, 'Reset link is invalid or has expired.', 400);

    user.password = password; // pre-save hook will hash it
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return sendSuccess(res, {}, 'Password reset successful. You can now log in.');
  } catch (err) {
    console.error('resetPassword error:', err);
    return sendError(res, 'Server error during password reset.', 500);
  }
};

module.exports = { signup, login, verifyOtp, forgotPassword, resetPassword };
