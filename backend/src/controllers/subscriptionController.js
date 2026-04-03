const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['5 risk predictions/day', 'Basic weather data', 'Profit calculator'],
  },
  pro: {
    name: 'Pro',
    price: 29,
    features: ['Unlimited predictions', 'Advanced ML analysis', 'Full dashboard analytics', 'Priority support'],
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    features: ['Everything in Pro', 'Custom ML models', 'API access', 'Dedicated support', 'White-label reports'],
  },
};

// ── GET /api/subscription/plans ───────────────────────────────────────────────
const getPlans = async (_req, res) => {
  return sendSuccess(res, { plans: PLANS });
};

// ── POST /api/subscription/upgrade ───────────────────────────────────────────
const upgradePlan = async (req, res) => {
  try {
    const { plan } = req.body;
    if (!plan || !['free', 'pro', 'enterprise'].includes(plan)) {
      return sendError(res, 'Invalid plan. Choose: free, pro, or enterprise.', 400);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { subscription: plan },
      { new: true }
    );

    return sendSuccess(
      res,
      {
        subscription: user.subscription,
        plan: PLANS[plan],
      },
      `Subscription upgraded to ${PLANS[plan].name} successfully.`
    );
  } catch (err) {
    console.error('upgradePlan error:', err);
    return sendError(res, 'Failed to upgrade plan.', 500);
  }
};

// ── GET /api/subscription/me ──────────────────────────────────────────────────
const getMyPlan = async (req, res) => {
  try {
    const plan = req.user.subscription || 'free';
    return sendSuccess(res, { subscription: plan, plan: PLANS[plan] });
  } catch (err) {
    return sendError(res, 'Failed to fetch subscription.', 500);
  }
};

module.exports = { getPlans, upgradePlan, getMyPlan };
