// Products API Route
const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

// Create new product
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.log('[v0] Error creating product:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.log('[v0] Error fetching products:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.log('[v0] Error fetching product:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.log('[v0] Error updating product:', error.message);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.log('[v0] Error deleting product:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
