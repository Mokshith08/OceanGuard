const Risk = require('../models/Risk');
const { getWeatherByCity } = require('../services/weatherService');
const { getPrediction, buildFeatures } = require('../services/mlService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// ── GET /api/risk/predict/:city ───────────────────────────────────────────────
const predictRisk = async (req, res) => {
  try {
    const { city } = req.params;
    const boatCount = parseInt(req.query.boats) || 1;

    if (!city) return sendError(res, 'City parameter is required.', 400);

    // 1. Fetch live weather data
    let weather;
    try {
      weather = await getWeatherByCity(city);
    } catch (err) {
      return sendError(res, `Unable to fetch weather for "${city}". Check city name or API key.`, 502);
    }

    // 2. Preprocess into ML feature vector
    const features = buildFeatures(weather, boatCount);

    // 3. Call ML microservice
    let mlPrediction;
    try {
      mlPrediction = await getPrediction(features);
    } catch (err) {
      console.warn('ML service unavailable, using rule-based fallback:', err.message);
      // Fallback: rule-based risk assessment from weather data
      const windKmh = weather.windSpeed * 3.6;
      mlPrediction = (windKmh > 40 || ['Thunderstorm', 'Snow'].includes(weather.condition)) ? 0 : 1;
    }

    // 4. Map prediction to human-readable label
    const riskLabel = mlPrediction === 1 ? 'Safe' : 'High Risk';

    // 5. Persist the record
    const riskRecord = await Risk.create({
      userId: req.user._id,
      city,
      weather,
      mlInput: features,
      mlPrediction,
      risk: riskLabel,
    });

    return sendSuccess(res, {
      id: riskRecord._id,
      city,
      risk: riskLabel,
      weather,
      mlInput: features,
      timestamp: riskRecord.createdAt,
    }, `Risk prediction complete for ${city}.`);
  } catch (err) {
    console.error('predictRisk error:', err);
    return sendError(res, 'Server error during risk prediction.', 500);
  }
};

// ── GET /api/risk/history ─────────────────────────────────────────────────────
const getRiskHistory = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Risk.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Risk.countDocuments({ userId: req.user._id }),
    ]);

    return sendSuccess(res, {
      records,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('getRiskHistory error:', err);
    return sendError(res, 'Failed to retrieve risk history.', 500);
  }
};

module.exports = { predictRisk, getRiskHistory };
