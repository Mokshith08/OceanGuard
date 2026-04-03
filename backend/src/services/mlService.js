const axios = require('axios');

/**
 * Call the Python FastAPI ML microservice to get a risk prediction.
 *
 * @param {number[]} features - [windSpeed, waveHeight, weatherCode, dayOfWeek, boatCount]
 * @returns {Promise<number>} - 1 = Safe, 0 = High Risk
 */
const getPrediction = async (features) => {
  const mlUrl = process.env.ML_API_URL || 'http://localhost:8001';

  const { data } = await axios.post(`${mlUrl}/predict`, { features }, {
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
  });

  return data.prediction; // 0 or 1
};

/**
 * Map weather data from OpenWeather to ML input features.
 * Feature vector: [windSpeed_kmh, estimatedWaveHeight, weatherCode, dayOfWeek, boatCount]
 *
 * @param {object} weather
 * @param {number} boatCount
 * @returns {number[]}
 */
const buildFeatures = (weather, boatCount = 1) => {
  const windKmh = (weather.windSpeed || 0) * 3.6; // m/s → km/h

  // Estimate wave height from wind speed (simplified Beaufort approximation)
  const waveHeight = Math.min(Math.pow(windKmh / 20, 1.5), 10).toFixed(2);

  // Encode weather condition as a numeric code
  const conditionMap = {
    Clear: 0, Clouds: 1, Rain: 2, Drizzle: 2,
    Thunderstorm: 3, Snow: 4, Mist: 5, Fog: 5,
  };
  const weatherCode = conditionMap[weather.condition] ?? 1;

  // Day of week (0=Mon … 6=Sun)
  const dayOfWeek = new Date().getDay();

  return [
    parseFloat(windKmh.toFixed(2)),
    parseFloat(waveHeight),
    weatherCode,
    dayOfWeek,
    1,
  ];
};

module.exports = { getPrediction, buildFeatures };
