const nodemailer = require('nodemailer');

/**
 * Create a Gmail transporter using App Password.
 * Uses nodemailer's built-in `service: 'gmail'` which automatically
 * picks the correct host/port (smtp.gmail.com, port 465, secure: true).
 */
const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// ── Email HTML Templates ──────────────────────────────────────────────────────

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
 * Send OTP email via Gmail App Password.
 * OTP is always logged to console as a visible backup in server logs.
 */
const sendOTPEmail = async (toEmail, otp) => {
  console.log(`[OTP] Generated for ${toEmail}: ${otp}`);

  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"OceanGuard 🌊" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your OceanGuard Login OTP',
    html: otpHtml(otp),
  });

  console.log(`[Email] OTP sent successfully to ${toEmail}`);
};

/**
 * Send contact confirmation email via Gmail.
 */
const sendContactConfirmation = async (toEmail, name) => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"OceanGuard 🌊" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "We've received your message – OceanGuard",
    html: contactHtml(name),
  });
};

module.exports = { sendOTPEmail, sendContactConfirmation };
