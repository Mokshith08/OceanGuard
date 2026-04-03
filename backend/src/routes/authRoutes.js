const express = require('express');
const router = express.Router();
const { signup, login, verifyOtp } = require('../controllers/authController');

// POST /api/auth/signup
router.post('/signup', signup);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOtp);

module.exports = router;
