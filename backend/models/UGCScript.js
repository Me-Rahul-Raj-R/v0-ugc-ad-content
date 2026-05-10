// UGC Script Model - Full Ad Scripts
const mongoose = require('mongoose');

const ugcScriptSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  hookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hook'
  },
  scriptType: {
    type: String,
    enum: ['30-sec', '15-sec', '45-sec', 'long-form'],
    default: '30-sec'
  },
  title: String,
  script: {
    hook: String,
    problem: String,
    discovery: String,
    result: String,
    cta: String
  },
  platform: {
    type: String,
    enum: ['instagram', 'facebook', 'youtube', 'tiktok'],
    default: 'instagram'
  },
  tone: String,
  language: {
    type: String,
    default: 'casual-english'
  },
  keywords: [String],
  status: {
    type: String,
    enum: ['draft', 'approved', 'published'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UGCScript', ugcScriptSchema);
