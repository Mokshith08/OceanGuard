const mongoose = require('mongoose');

const profitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    inputs: {
      hours: Number,
      boats: Number,
      efficiency: Number,
      season: String,
      pricePerKg: Number,
      operationalCosts: Number,
    },
    result: {
      catch: Number,       // kg
      revenue: Number,     // currency
      profit: Number,      // currency
      profitMargin: Number, // percentage
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profit', profitSchema);
