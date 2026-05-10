// Hook Model - UGC Ad Hooks (First 1-3 seconds)
const mongoose = require('mongoose');

const hookSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  hookType: {
    type: String,
    enum: ['frustration', 'confession', 'curiosity', 'pattern-break', 'transformation'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 100
  },
  wordCount: {
    type: Number,
    max: 10,
    required: true
  },
  platform: {
    type: String,
    enum: ['instagram', 'facebook', 'youtube', 'tiktok'],
    default: 'instagram'
  },
  tone: String,
  performance: {
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hook', hookSchema);
