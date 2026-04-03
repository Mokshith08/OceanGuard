const Risk = require('../models/Risk');
const Profit = require('../models/Profit');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ── GET /api/dashboard/risk-history ──────────────────────────────────────────
const getRiskHistory = async (req, res) => {
  try {
    const records = await Risk.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
    return sendSuccess(res, { records });
  } catch (err) {
    return sendError(res, 'Failed to fetch risk history.', 500);
  }
};

// ── GET /api/dashboard/profit-history ────────────────────────────────────────
const getProfitHistory = async (req, res) => {
  try {
    const records = await Profit.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();
    return sendSuccess(res, { records });
  } catch (err) {
    return sendError(res, 'Failed to fetch profit history.', 500);
  }
};

// ── GET /api/dashboard/analytics ─────────────────────────────────────────────
const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    const [
      totalPredictions,
      riskDistribution,
      profitStats,
      recentActivity,
    ] = await Promise.all([
      // Total risk predictions
      Risk.countDocuments({ userId }),

      // Risk distribution: safe vs high risk
      Risk.aggregate([
        { $match: { userId } },
        { $group: { _id: '$risk', count: { $sum: 1 } } },
      ]),

      // Profit aggregates
      Profit.aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: null,
            totalProfit: { $sum: '$result.profit' },
            totalRevenue: { $sum: '$result.revenue' },
            totalCatch: { $sum: '$result.catch' },
            avgProfitMargin: { $avg: '$result.profitMargin' },
            count: { $sum: 1 },
          },
        },
      ]),

      // Last 7 days risk trend
      Risk.aggregate([
        {
          $match: {
            userId,
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            safe: {
              $sum: { $cond: [{ $eq: ['$risk', 'Safe'] }, 1, 0] },
            },
            highRisk: {
              $sum: { $cond: [{ $eq: ['$risk', 'High Risk'] }, 1, 0] },
            },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const riskDist = { safe: 0, highRisk: 0 };
    riskDistribution.forEach((r) => {
      if (r._id === 'Safe') riskDist.safe = r.count;
      else if (r._id === 'High Risk') riskDist.highRisk = r.count;
    });

    const profitSummary = profitStats[0] || {
      totalProfit: 0,
      totalRevenue: 0,
      totalCatch: 0,
      avgProfitMargin: 0,
      count: 0,
    };

    return sendSuccess(res, {
      totalPredictions,
      riskDistribution: riskDist,
      profit: {
        totalCalculations: profitSummary.count,
        totalProfit: parseFloat((profitSummary.totalProfit || 0).toFixed(2)),
        totalRevenue: parseFloat((profitSummary.totalRevenue || 0).toFixed(2)),
        totalCatch: parseFloat((profitSummary.totalCatch || 0).toFixed(2)),
        avgProfitMargin: parseFloat((profitSummary.avgProfitMargin || 0).toFixed(2)),
      },
      recentActivity, // 7-day daily risk breakdown
    });
  } catch (err) {
    console.error('getAnalytics error:', err);
    return sendError(res, 'Failed to fetch analytics.', 500);
  }
};

module.exports = { getRiskHistory, getProfitHistory, getAnalytics };
