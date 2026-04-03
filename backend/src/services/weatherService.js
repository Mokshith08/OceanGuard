const axios = require('axios');

/**
 * Fetch current weather data from OpenWeather API by city name.
 *
 * @param {string} city
 * @returns {Promise<{temperature, windSpeed, condition, humidity, pressure, description}>}
 */
const getWeatherByCity = async (city) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) throw new Error('OPENWEATHER_API_KEY not configured');

  const url = `https://api.openweathermap.org/data/2.5/weather`;

  const { data } = await axios.get(url, {
    params: {
      q: city,
      appid: apiKey,
      units: 'metric',
    },
    timeout: 10000,
  });

  return {
    temperature: data.main.temp,
    windSpeed: data.wind.speed,           // m/s
    condition: data.weather[0].main,       // "Rain", "Clear", etc.
    description: data.weather[0].description,
    humidity: data.main.humidity,          // %
    pressure: data.main.pressure,          // hPa
  };
};

module.exports = { getWeatherByCity };
