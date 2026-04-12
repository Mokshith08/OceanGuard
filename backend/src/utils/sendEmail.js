const nodemailer = require('nodemailer');

/**
 * Try to send via a specific port/secure combo.
 */
const tryTransport = (port, secure) => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
  });
};

/**
 * Send an OTP email for login verification.
 * Always logs the OTP to console (visible in Render logs as a fallback).
 * Tries port 465 (SSL) first, then falls back to 587 (STARTTLS).
 */
const sendOTPEmail = async (toEmail, otp) => {
  // Always log the OTP — visible in Render logs if email fails
  console.log(`[OTP] Generated for ${toEmail}: ${otp}`);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[Email] EMAIL_USER or EMAIL_PASS not set — skipping SMTP send');
    return;
  }

  const mailOptions = {
    from: `"OceanGuard 🌊" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Your OceanGuard Login OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border-radius: 12px; background: #0f172a; color: #f1f5f9;">
        <h1 style="color: #38bdf8; margin-bottom: 8px;">🌊 OceanGuard</h1>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 24px;">AI-Powered Marine Intelligence</p>
        <h2 style="margin-bottom: 8px;">Your Login OTP</h2>
        <p style="color: #cbd5e1;">Use the code below to complete your sign-in. This code is valid for <strong>5 minutes</strong>.</p>
        <div style="margin: 24px 0; text-align: center;">
          <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #38bdf8; background: #1e293b; padding: 16px 24px; border-radius: 8px; display: inline-block;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 12px;">If you did not request this, please ignore this email. Never share your OTP with anyone.</p>
      </div>
    `,
  };

  // Try port 465 (SSL) first — more reliable on cloud platforms
  try {
    const t = tryTransport(465, true);
    await t.sendMail(mailOptions);
    console.log(`[Email] OTP sent via port 465 to ${toEmail}`);
    return;
  } catch (err465) {
    console.warn(`[Email] Port 465 failed: ${err465.message} — trying port 587...`);
  }

  // Fallback: port 587 (STARTTLS)
  try {
    const t = tryTransport(587, false);
    await t.sendMail(mailOptions);
    console.log(`[Email] OTP sent via port 587 to ${toEmail}`);
    return;
  } catch (err587) {
    console.error(`[Email] Port 587 also failed: ${err587.message}`);
    throw new Error(`SMTP failed on both port 465 and 587: ${err587.message}`);
  }
};

/**
 * Send a contact confirmation email
 */
const sendContactConfirmation = async (toEmail, name) => {
  const transporter = createTransport();

  const mailOptions = {
    from: `"OceanGuard 🌊" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "We've received your message – OceanGuard",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border-radius: 12px; background: #0f172a; color: #f1f5f9;">
        <h1 style="color: #38bdf8;">🌊 OceanGuard</h1>
        <h2>Hi ${name},</h2>
        <p style="color: #cbd5e1;">Thank you for reaching out! We've received your message and our team will get back to you within <strong>24-48 hours</strong>.</p>
        <p style="color: #64748b; font-size: 12px; margin-top: 32px;">— The OceanGuard Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTPEmail, sendContactConfirmation };
