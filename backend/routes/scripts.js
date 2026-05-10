// UGC Scripts API Route
const express = require('express');
const UGCScript = require('../models/UGCScript');

const router = express.Router();

// Create script
router.post('/', async (req, res) => {
  try {
    const script = new UGCScript(req.body);
    await script.save();
    res.status(201).json({
      success: true,
      message: 'UGC script created successfully',
      data: script
    });
  } catch (error) {
    console.log('[v0] Error creating script:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get scripts by product
router.get('/product/:productId', async (req, res) => {
  try {
    const scripts = await UGCScript.find({ productId: req.params.productId });
    res.json({
      success: true,
      count: scripts.length,
      data: scripts
    });
  } catch (error) {
    console.log('[v0] Error fetching scripts:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all scripts
router.get('/', async (req, res) => {
  try {
    const scripts = await UGCScript.find();
    res.json({
      success: true,
      count: scripts.length,
      data: scripts
    });
  } catch (error) {
    console.log('[v0] Error fetching scripts:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update script
router.put('/:id', async (req, res) => {
  try {
    const script = await UGCScript.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({
      success: true,
      message: 'Script updated successfully',
      data: script
    });
  } catch (error) {
    console.log('[v0] Error updating script:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
