const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const riskRoutes = require('./routes/riskRoutes');
const profitRoutes = require('./routes/profitRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const contactRoutes = require('./routes/contactRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();

// ── Security & Middleware ─────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000', 'http://localhost:8080'],
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ success: true, message: '🌊 OceanGuard API is live', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/profit', profitRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/subscription', subscriptionRoutes);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('❌ Unhandled Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
