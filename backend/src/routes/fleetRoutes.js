const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  saveCalculation,
  getHistory,
  getPeriodSummary,
  getActiveCalculations,
} = require('../controllers/fleetController');

// POST /api/fleet/save   — save fleet calculation to DB
router.post('/save', protect, saveCalculation);

// GET  /api/fleet/active — get calculations from last 24h
router.get('/active', protect, getActiveCalculations);

// GET  /api/fleet/history?page=1&limit=20  — full paginated history
router.get('/history', protect, getHistory);

// GET  /api/fleet/summary?period=weekly|monthly|yearly
router.get('/summary', protect, getPeriodSummary);

module.exports = router;
