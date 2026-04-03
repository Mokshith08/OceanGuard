const express = require('express');
const router = express.Router();
const { calculateProfit, getProfitHistory } = require('../controllers/profitController');
const { protect } = require('../middleware/auth');

// POST /api/profit/calculate  — auth required
router.post('/calculate', protect, calculateProfit);

// GET /api/profit/history  — auth required
router.get('/history', protect, getProfitHistory);

module.exports = router;
