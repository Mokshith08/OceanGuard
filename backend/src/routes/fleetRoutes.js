const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  saveCalculation,
  getHistory,
  getPeriodSummary,
  getActiveCalculations,
} = require('../controllers/fleetController');

// All routes require authentication
router.use(auth);

// POST /api/fleet/save   — save fleet calculation to DB
router.post('/save', saveCalculation);

// GET  /api/fleet/active — get calculations from last 24h
router.get('/active', getActiveCalculations);

// GET  /api/fleet/history?page=1&limit=20  — full paginated history
router.get('/history', getHistory);

// GET  /api/fleet/summary?period=weekly|monthly|yearly
router.get('/summary', getPeriodSummary);

module.exports = router;
