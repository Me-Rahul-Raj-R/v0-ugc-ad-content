// Product Model - Store D2C Products/Businesses
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    example: 'Hair Growth Serum'
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['d2c', 'local-business', 'saas', 'creator-brand'],
    required: true
  },
  targetAudience: {
    ageRange: String,
    gender: String,
    region: String,
    painPoints: [String]
  },
  price: String,
  platform: {
    type: [String],
    enum: ['instagram', 'facebook', 'youtube', 'tiktok'],
    default: ['instagram']
  },
  usp: [String], // Unique Selling Points
  brand: {
    tone: String,
    example: 'honest, friendly'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
