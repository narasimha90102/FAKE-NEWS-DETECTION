const fs = require('fs');
const path = require('path');

module.exports = async function globalSetup() {
  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
  console.log('🚀 TruthGuard Selenium Tests Starting...');
  console.log(`📍 Base URL: ${process.env.BASE_URL || 'http://localhost:5173'}`);
  console.log(`📡 API URL: ${process.env.API_URL || 'http://localhost:5050'}`);
};
