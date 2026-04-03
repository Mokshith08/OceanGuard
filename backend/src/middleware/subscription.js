const { sendError } = require('../utils/apiResponse');

const PLAN_HIERARCHY = { free: 0, pro: 1, enterprise: 2 };

/**
 * Middleware factory — requires a minimum subscription plan.
 * Usage: requirePlan('pro')
 */
const requirePlan = (minPlan) => {
  return (req, res, next) => {
    const userPlan = req.user?.subscription || 'free';
    if (PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[minPlan]) {
      return next();
    }
    return sendError(
      res,
      `This feature requires a ${minPlan} subscription. Please upgrade your plan.`,
      403
    );
  };
};

module.exports = { requirePlan };
