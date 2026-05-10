// Hooks API Route
const express = require('express');
const Hook = require('../models/Hook');

const router = express.Router();

// Create hooks
router.post('/', async (req, res) => {
  try {
    const hook = new Hook(req.body);
    await hook.save();
    res.status(201).json({
      success: true,
      message: 'Hook created successfully',
      data: hook
    });
  } catch (error) {
    console.log('[v0] Error creating hook:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get hooks by product
router.get('/product/:productId', async (req, res) => {
  try {
    const hooks = await Hook.find({ productId: req.params.productId });
    res.json({
      success: true,
      count: hooks.length,
      data: hooks
    });
  } catch (error) {
    console.log('[v0] Error fetching hooks:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get hooks by type
router.get('/type/:hookType', async (req, res) => {
  try {
    const hooks = await Hook.find({ hookType: req.params.hookType });
    res.json({
      success: true,
      count: hooks.length,
      data: hooks
    });
  } catch (error) {
    console.log('[v0] Error fetching hooks:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all hooks
router.get('/', async (req, res) => {
  try {
    const hooks = await Hook.find();
    res.json({
      success: true,
      count: hooks.length,
      data: hooks
    });
  } catch (error) {
    console.log('[v0] Error fetching hooks:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
