require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🌊 OceanGuard server running on port ${PORT}`);
    console.log(`📡 ML Service: ${process.env.ML_API_URL}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}\n`);
  });
};

startServer();
console.log("MONGO_URI:", process.env.MONGO_URI);