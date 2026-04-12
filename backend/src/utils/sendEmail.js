const axios = require('axios');

// ── Resend HTTP API (works on Render — no SMTP port needed) ───────────────────
const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * Send email via Resend HTTP API.
 * Works on all cloud platforms since it uses HTTPS (port 443).
 */
const sendViaResend = async (to, subject, html) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not set in environment');

  // Use your verified domain if set, otherwise use Resend's free sandbox sender
  const from = process.env.EMAIL_FROM || 'OceanGuard <onboarding@resend.dev>';

  await axios.post(
    RESEND_API_URL,
    { from, to: [to], subject, html },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    }
  );
};

// ── OTP Email Template ────────────────────────────────────────────────────────
const otpHtml = (otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px;
              border-radius: 12px; background: #0f172a; color: #f1f5f9;">
    <h1 style="color: #38bdf8; margin-bottom: 8px;">🌊 OceanGuard</h1>
    <p style="color: #94a3b8; font-size: 14px; margin-bottom: 24px;">AI-Powered Marine Intelligence</p>
    <h2 style="margin-bottom: 8px;">Your Login OTP</h2>
    <p style="color: #cbd5e1;">Use the code below to complete your sign-in.
       This code is valid for <strong>5 minutes</strong>.</p>
    <div style="margin: 24px 0; text-align: center;">
      <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #38bdf8;
                   background: #1e293b; padding: 16px 24px; border-radius: 8px;
                   display: inline-block;">${otp}</span>
    </div>
    <p style="color: #64748b; font-size: 12px;">
      If you did not request this, please ignore this email.
      Never share your OTP with anyone.
    </p>
  </div>
`;

// ── Contact Confirmation Template ─────────────────────────────────────────────
const contactHtml = (name) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px;
              border-radius: 12px; background: #0f172a; color: #f1f5f9;">
    <h1 style="color: #38bdf8;">🌊 OceanGuard</h1>
    <h2>Hi ${name},</h2>
    <p style="color: #cbd5e1;">Thank you for reaching out! We've received your message
       and our team will get back to you within <strong>24-48 hours</strong>.</p>
    <p style="color: #64748b; font-size: 12px; margin-top: 32px;">— The OceanGuard Team</p>
  </div>
`;

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Send OTP email.
 * Always logs OTP to console (visible in Render logs as backup).
 */
const sendOTPEmail = async (toEmail, otp) => {
  console.log(`[OTP] Generated for ${toEmail}: ${otp}`);
  await sendViaResend(toEmail, 'Your OceanGuard Login OTP', otpHtml(otp));
  console.log(`[Email] OTP email sent to ${toEmail}`);
};

/**
 * Send contact confirmation email.
 */
const sendContactConfirmation = async (toEmail, name) => {
  await sendViaResend(
    toEmail,
    "We've received your message – OceanGuard",
    contactHtml(name)
  );
};

module.exports = { sendOTPEmail, sendContactConfirmation };


