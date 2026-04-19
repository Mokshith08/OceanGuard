const FleetCalculation = require('../models/FleetCalculation');
const { success, error } = require('../utils/apiResponse');

/**
 * POST /api/fleet/save
 * Save a completed fleet calculation to the database.
 */
const saveCalculation = async (req, res) => {
  try {
    const { marketPrice, boats } = req.body;

    if (!marketPrice || !Array.isArray(boats) || boats.length === 0) {
      return error(res, 'marketPrice and boats array are required', 400);
    }

    // Compute summary from boats
    const totalCatch = boats.reduce((s, b) => s + (b.fishCaught || 0), 0);
    const totalRevenue = boats.reduce((s, b) => s + (b.revenue || 0), 0);
    const totalCost = boats.reduce((s, b) => s + (b.totalCost || 0), 0);
    const totalProfit = boats.reduce((s, b) => s + (b.profit || 0), 0);
    const profitMargin = totalRevenue > 0
      ? parseFloat(((totalProfit / totalRevenue) * 100).toFixed(2))
      : 0;

    const calc = await FleetCalculation.create({
      userId: req.user.id,
      marketPrice,
      boats,
      summary: { totalCatch, totalRevenue, totalCost, totalProfit, profitMargin },
    });

    return success(res, { calculation: calc }, 'Calculation saved', 201);
  } catch (err) {
    console.error('saveCalculation error:', err);
    return error(res, 'Failed to save calculation', 500);
  }
};

/**
 * GET /api/fleet/history?page=1&limit=20
 * Get all past calculations for the logged-in user (newest first).
 */
const getHistory = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      FleetCalculation.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      FleetCalculation.countDocuments({ userId: req.user.id }),
    ]);

    // Mark which records are "active" (< 24 hours old)
    const now = Date.now();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const recordsWithStatus = records.map((r) => ({
      ...r,
      isActive: now - new Date(r.createdAt).getTime() < ONE_DAY_MS,
    }));

    return success(res, {
      records: recordsWithStatus,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('getHistory error:', err);
    return error(res, 'Failed to fetch history', 500);
  }
};

/**
 * GET /api/fleet/summary?period=weekly|monthly|yearly
 * Aggregate profit totals for the given time period.
 */
const getPeriodSummary = async (req, res) => {
  try {
    const period = req.query.period || 'monthly';

    // Determine the start date for the period
    const now = new Date();
    let startDate;
    if (period === 'weekly') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'monthly') {
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'yearly') {
      startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      return error(res, 'period must be weekly, monthly, or yearly', 400);
    }

    // Aggregate for the period
    const [aggregate] = await FleetCalculation.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalCalculations: { $sum: 1 },
          totalRevenue: { $sum: '$summary.totalRevenue' },
          totalCost: { $sum: '$summary.totalCost' },
          totalProfit: { $sum: '$summary.totalProfit' },
          totalCatch: { $sum: '$summary.totalCatch' },
          avgProfitMargin: { $avg: '$summary.profitMargin' },
        },
      },
    ]);

    // Also get the trend — group by day for charting
    const trend = await FleetCalculation.aggregate([
      {
        $match: {
          userId: req.user._id,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: period === 'yearly' ? '%Y-%m' : '%Y-%m-%d',
              date: '$createdAt',
            },
          },
          revenue: { $sum: '$summary.totalRevenue' },
          profit: { $sum: '$summary.totalProfit' },
          cost: { $sum: '$summary.totalCost' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return success(res, {
      period,
      summary: aggregate || {
        totalCalculations: 0,
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        totalCatch: 0,
        avgProfitMargin: 0,
      },
      trend,
    });
  } catch (err) {
    console.error('getPeriodSummary error:', err);
    return error(res, 'Failed to fetch period summary', 500);
  }
};

/**
 * GET /api/fleet/active
 * Returns only calculations from the last 24 hours (active view).
 */
const getActiveCalculations = async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const records = await FleetCalculation.find({
      userId: req.user.id,
      createdAt: { $gte: since },
    })
      .sort({ createdAt: -1 })
      .lean();

    return success(res, { records, isActive: true });
  } catch (err) {
    console.error('getActiveCalculations error:', err);
    return error(res, 'Failed to fetch active calculations', 500);
  }
};

module.exports = { saveCalculation, getHistory, getPeriodSummary, getActiveCalculations };
