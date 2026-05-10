// UGC Ad Generator Backend Server
// Technology: Node.js + Express + MongoDB

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ugc-ads';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('[v0] MongoDB connected'))
  .catch((err) => console.log('[v0] MongoDB error:', err));

// Import Routes
const productRoutes = require('./routes/products');
const promptRoutes = require('./routes/prompts');
const scriptRoutes = require('./routes/scripts');
const hookRoutes = require('./routes/hooks');
const ctaRoutes = require('./routes/ctas');

// Use Routes
app.use('/api/products', productRoutes);
app.use('/api/prompts', promptRoutes);
app.use('/api/scripts', scriptRoutes);
app.use('/api/hooks', hookRoutes);
app.use('/api/ctas', ctaRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'UGC Ad Generator Backend Running' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[v0] Server running on port ${PORT}`);
});

module.exports = app;
