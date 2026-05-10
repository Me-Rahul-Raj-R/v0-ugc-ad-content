// CTA API Route
const express = require('express');
const CTA = require('../models/CTA');

const router = express.Router();

// Create CTA
router.post('/', async (req, res) => {
  try {
    const cta = new CTA(req.body);
    await cta.save();
    res.status(201).json({
      success: true,
      message: 'CTA created successfully',
      data: cta
    });
  } catch (error) {
    console.log('[v0] Error creating CTA:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get CTAs by product
router.get('/product/:productId', async (req, res) => {
  try {
    const ctas = await CTA.find({ productId: req.params.productId });
    res.json({
      success: true,
      count: ctas.length,
      data: ctas
    });
  } catch (error) {
    console.log('[v0] Error fetching CTAs:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all CTAs
router.get('/', async (req, res) => {
  try {
    const ctas = await CTA.find();
    res.json({
      success: true,
      count: ctas.length,
      data: ctas
    });
  } catch (error) {
    console.log('[v0] Error fetching CTAs:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
