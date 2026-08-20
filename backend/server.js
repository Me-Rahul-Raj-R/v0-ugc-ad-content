// UGC Ad Generator Backend Server
// Technology: Node.js + Express + MySQL 8.0 (MySQL Workbench Ready)

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initializeDatabase, getPool, dbConfig } = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize MySQL Database
initializeDatabase();

// Import Routes
const productRoutes = require('./routes/products');
const promptRoutes = require('./routes/prompts');
const scriptRoutes = require('./routes/scripts');
const hookRoutes = require('./routes/hooks');
const ctaRoutes = require('./routes/ctas');

// Register API Routes
app.use('/api/products', productRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/scripts', scriptRoutes);
app.use('/api/hooks', hookRoutes);
app.use('/api/ctas', ctaRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'UGC Ad Generator Backend is running',
    timestamp: new Date().toISOString()
  });
});

// MySQL Database Status & Diagnostics
app.get('/api/db-status', async (req, res) => {
  try {
    const pool = getPool();
    const [result] = await pool.query('SELECT 1 + 1 AS solution, DATABASE() AS current_db, VERSION() AS mysql_version');
    const [productCount] = await pool.query('SELECT COUNT(*) as count FROM products');
    const [hookCount] = await pool.query('SELECT COUNT(*) as count FROM hooks');
    const [scriptCount] = await pool.query('SELECT COUNT(*) as count FROM scripts');
    const [ctaCount] = await pool.query('SELECT COUNT(*) as count FROM ctas');

    res.json({
      connected: true,
      database: result[0].current_db || dbConfig.database,
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      mysqlVersion: result[0].mysql_version,
      stats: {
        products: productCount[0].count,
        hooks: hookCount[0].count,
        scripts: scriptCount[0].count,
        ctas: ctaCount[0].count
      }
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error.message,
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database,
      suggestion: 'Ensure MySQL Server is running in MySQL Workbench and credentials match backend/.env'
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[UGC Backend] Server running on http://localhost:${PORT}`);
  console.log(`[UGC Backend] MySQL Database target: ${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}`);
});

module.exports = app;
