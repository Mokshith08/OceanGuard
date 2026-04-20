const axios = require('axios');

/**
 * Get a fresh Gmail access token using the stored refresh token (OAuth2).
 * This uses HTTPS so it works on any cloud platform including Render.
 */
const getGmailAccessToken = async () => {
  try {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GMAIL_CLIENT_ID,
      client_secret: process.env.GMAIL_CLIENT_SECRET,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    });
    return data.access_token;
  } catch (err) {
    const detail = err.response?.data || err.message;
    console.error('[Gmail OAuth2] Token refresh failed:', JSON.stringify(detail));
    throw new Error(`Gmail OAuth2 token refresh failed: ${JSON.stringify(detail)}`);
  }
};

/**
 * Send email via Gmail REST API (HTTPS — not SMTP, works on Render).
 * Sends FROM oceanguard.team@gmail.com using OAuth2.
 */
const sendViaGmailAPI = async (to, subject, html) => {
  const accessToken = await getGmailAccessToken();

  // Build RFC 2822 email message
  const emailLines = [
    `From: OceanGuard <${process.env.EMAIL_USER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    html,
  ];
  const rawMessage = emailLines.join('\r\n');

  // Base64url encode (required by Gmail API)
  const encodedMessage = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await axios.post(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/send`,
    { raw: encodedMessage },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    }
  );
};

// ── Email Templates ───────────────────────────────────────────────────────────

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

const sendOTPEmail = async (toEmail, otp) => {
  console.log(`[OTP] Generated for ${toEmail}: ${otp}`);
  await sendViaGmailAPI(toEmail, 'Your OceanGuard Login OTP', otpHtml(otp));
  console.log(`[Email] OTP sent via Gmail API to ${toEmail}`);
};

const sendContactConfirmation = async (toEmail, name) => {
  await sendViaGmailAPI(
    toEmail,
    "We've received your message – OceanGuard",
    contactHtml(name)
  );
};

const sendPasswordResetEmail = async (toEmail, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px;
                border-radius: 12px; background: #0f172a; color: #f1f5f9;">
      <h1 style="color: #38bdf8; margin-bottom: 8px;">🌊 OceanGuard</h1>
      <p style="color: #94a3b8; font-size: 14px; margin-bottom: 24px;">AI-Powered Marine Intelligence</p>
      <h2 style="margin-bottom: 8px;">Reset Your Password</h2>
      <p style="color: #cbd5e1;">You requested a password reset. Click the button below to set a new password.
         This link is valid for <strong>1 hour</strong>.</p>
      <div style="margin: 32px 0; text-align: center;">
        <a href="${resetUrl}"
           style="background: #38bdf8; color: #0f172a; padding: 14px 32px; border-radius: 8px;
                  text-decoration: none; font-weight: bold; font-size: 16px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #64748b; font-size: 12px;">
        If you did not request a password reset, you can safely ignore this email.
        This link will expire in 1 hour.
      </p>
    </div>
  `;
  await sendViaGmailAPI(toEmail, 'Reset Your OceanGuard Password', html);
  console.log(`[Email] Password reset email sent to ${toEmail}`);
};

module.exports = { sendOTPEmail, sendContactConfirmation, sendPasswordResetEmail };

