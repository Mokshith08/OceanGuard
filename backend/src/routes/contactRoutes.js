const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');

// POST /api/contact  — public
router.post('/', submitContact);

module.exports = router;
