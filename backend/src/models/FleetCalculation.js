const mongoose = require('mongoose');

const boatResultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fishCaught: { type: Number, required: true },
  fuelCost: { type: Number, default: 0 },
  laborCost: { type: Number, default: 0 },
  maintenanceCost: { type: Number, default: 0 },
  totalCost: { type: Number, required: true },
  revenue: { type: Number, required: true },
  profit: { type: Number, required: true },
}, { _id: false });

const fleetCalculationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    marketPrice: {
      type: Number,
      required: true,
    },
    boats: {
      type: [boatResultSchema],
      required: true,
    },
    summary: {
      totalCatch: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
      totalCost: { type: Number, default: 0 },
      totalProfit: { type: Number, default: 0 },
      profitMargin: { type: Number, default: 0 }, // percentage
    },
  },
  { timestamps: true }
);

// Index for fast period-based queries
fleetCalculationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('FleetCalculation', fleetCalculationSchema);
