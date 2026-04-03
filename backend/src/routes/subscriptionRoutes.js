const express = require('express');
const router = express.Router();
const { getPlans, upgradePlan, getMyPlan } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/auth');

// GET /api/subscription/plans  — public
router.get('/plans', getPlans);

// Auth required below
router.use(protect);

// GET /api/subscription/me
router.get('/me', getMyPlan);

// POST /api/subscription/upgrade
router.post('/upgrade', upgradePlan);

module.exports = router;
