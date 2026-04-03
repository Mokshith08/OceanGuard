const express = require('express');
const router = express.Router();
const { getRiskHistory, getProfitHistory, getAnalytics } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// All dashboard routes require authentication
router.use(protect);

// GET /api/dashboard/risk-history
router.get('/risk-history', getRiskHistory);

// GET /api/dashboard/profit-history
router.get('/profit-history', getProfitHistory);

// GET /api/dashboard/analytics
router.get('/analytics', getAnalytics);

module.exports = router;
