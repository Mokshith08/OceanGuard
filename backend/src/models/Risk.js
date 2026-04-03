const mongoose = require('mongoose');

const riskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    weather: {
      temperature: Number,
      windSpeed: Number,
      condition: String,
      humidity: Number,
      pressure: Number,
      description: String,
    },
    mlInput: {
      type: [Number],
    },
    mlPrediction: {
      type: Number, // raw: 0 or 1
    },
    risk: {
      type: String,
      enum: ['Safe', 'High Risk'],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Risk', riskSchema);
