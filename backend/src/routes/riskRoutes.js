const express = require('express');
const router = express.Router();
const { predictRisk, getRiskHistory } = require('../controllers/riskController');
const { protect } = require('../middleware/auth');

// GET /api/risk/predict/:city  — auth required
router.get('/predict/:city', protect, predictRisk);

// GET /api/risk/history  — auth required
router.get('/history', protect, getRiskHistory);

module.exports = router;
