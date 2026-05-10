// CTA Model - Call-To-Action variations
const mongoose = require('mongoose');

const ctaSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  ctaType: {
    type: String,
    enum: ['soft', 'medium', 'direct'],
    default: 'soft'
  },
  content: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['instagram', 'facebook', 'youtube', 'tiktok'],
    default: 'instagram'
  },
  tone: String,
  examples: [String],
  conversionRate: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CTA', ctaSchema);
