const Contact = require('../models/Contact');
const { sendContactConfirmation } = require('../utils/sendEmail');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ── POST /api/contact ─────────────────────────────────────────────────────────
const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return sendError(res, 'Name, email and message are required.', 400);
    }

    const contact = await Contact.create({ name, email, message });

    // Send confirmation email (non-blocking — don't fail the request if email fails)
    sendContactConfirmation(email, name).catch((err) =>
      console.warn('Contact email failed (non-fatal):', err.message)
    );

    return sendSuccess(
      res,
      { id: contact._id },
      "Message received. We'll get back to you within 24-48 hours.",
      201
    );
  } catch (err) {
    console.error('submitContact error:', err);
    return sendError(res, 'Server error. Please try again.', 500);
  }
};

module.exports = { submitContact };
