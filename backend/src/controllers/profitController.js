const Profit = require('../models/Profit');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// Seasonal catch multipliers
const SEASONAL_FACTORS = {
  spring: 1.2,
  summer: 1.5,
  monsoon: 0.6,
  autumn: 1.1,
  winter: 0.8,
};

// ── POST /api/profit/calculate ────────────────────────────────────────────────
const calculateProfit = async (req, res) => {
  try {
    const { hours, boats, efficiency, season, pricePerKg, operationalCosts } = req.body;

    // Validation
    if (!hours || !boats || !efficiency || !season || !pricePerKg || operationalCosts === undefined) {
      return sendError(res, 'All fields are required: hours, boats, efficiency, season, pricePerKg, operationalCosts.', 400);
    }

    const seasonalFactor = SEASONAL_FACTORS[season.toLowerCase()] ?? 1.0;

    // Core formula
    const catchKg = parseFloat((hours * boats * efficiency * seasonalFactor).toFixed(2));
    const revenue = parseFloat((catchKg * pricePerKg).toFixed(2));
    const profit = parseFloat((revenue - operationalCosts).toFixed(2));
    const profitMargin = revenue > 0
      ? parseFloat(((profit / revenue) * 100).toFixed(2))
      : 0;

    const inputs = { hours, boats, efficiency, season, pricePerKg, operationalCosts };
    const result = { catch: catchKg, revenue, profit, profitMargin };

    const record = await Profit.create({ userId: req.user._id, inputs, result });

    return sendSuccess(res, {
      id: record._id,
      inputs,
      result,
      seasonalFactor,
      timestamp: record.createdAt,
    }, 'Profit calculated successfully.');
  } catch (err) {
    console.error('calculateProfit error:', err);
    return sendError(res, 'Server error during profit calculation.', 500);
  }
};

// ── GET /api/profit/history ───────────────────────────────────────────────────
const getProfitHistory = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Profit.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Profit.countDocuments({ userId: req.user._id }),
    ]);

    return sendSuccess(res, {
      records,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('getProfitHistory error:', err);
    return sendError(res, 'Failed to retrieve profit history.', 500);
  }
};

module.exports = { calculateProfit, getProfitHistory };
