// Products API Route (MySQL)
const express = require('express');
const { getPool } = require('../config/db');

const router = express.Router();

function formatProduct(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    price: row.price,
    targetAudience: {
      ageRange: row.age_range || '20-35',
      gender: row.gender || 'All',
      region: row.region || 'India',
      painPoints: typeof row.pain_points === 'string' ? JSON.parse(row.pain_points || '[]') : (row.pain_points || [])
    },
    usp: typeof row.usp === 'string' ? JSON.parse(row.usp || '[]') : (row.usp || []),
    platform: typeof row.platforms === 'string' ? JSON.parse(row.platforms || '[]') : (row.platforms || ['instagram']),
    brand: {
      tone: row.brand_tone || 'honest, friendly'
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// Create new product
router.post('/', async (req, res) => {
  try {
    const { name, description, category, price, targetAudience, usp, platform, brand } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        error: 'Product name and description are required'
      });
    }

    const pool = getPool();
    const ageRange = targetAudience?.ageRange || '20-35';
    const gender = targetAudience?.gender || 'All';
    const region = targetAudience?.region || 'India';
    const painPoints = JSON.stringify(targetAudience?.painPoints || []);
    const uspJson = JSON.stringify(usp || []);
    const platformsJson = JSON.stringify(platform || ['instagram']);
    const brandTone = brand?.tone || 'honest, friendly';

    const [result] = await pool.query(
      `INSERT INTO products (name, description, category, price, age_range, gender, region, pain_points, usp, platforms, brand_tone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, category || 'd2c', price || '', ageRange, gender, region, painPoints, uspJson, platformsJson, brandTone]
    );

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    const createdProduct = formatProduct(rows[0]);

    res.status(201).json({
      success: true,
      message: 'Product created successfully in MySQL',
      data: createdProduct
    });
  } catch (error) {
    console.error('[MySQL] Error creating product:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    const formatted = rows.map(formatProduct);

    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    console.error('[MySQL] Error fetching products:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: formatProduct(rows[0])
    });
  } catch (error) {
    console.error('[MySQL] Error fetching product:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const pool = getPool();
    const { name, description, category, price, targetAudience, usp, platform, brand } = req.body;

    const ageRange = targetAudience?.ageRange || '20-35';
    const gender = targetAudience?.gender || 'All';
    const region = targetAudience?.region || 'India';
    const painPoints = JSON.stringify(targetAudience?.painPoints || []);
    const uspJson = JSON.stringify(usp || []);
    const platformsJson = JSON.stringify(platform || ['instagram']);
    const brandTone = brand?.tone || 'honest, friendly';

    await pool.query(
      `UPDATE products 
       SET name = ?, description = ?, category = ?, price = ?, age_range = ?, gender = ?, region = ?, pain_points = ?, usp = ?, platforms = ?, brand_tone = ?
       WHERE id = ?`,
      [name, description, category, price, ageRange, gender, region, painPoints, uspJson, platformsJson, brandTone, req.params.id]
    );

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Product updated successfully in MySQL',
      data: formatProduct(rows[0])
    });
  } catch (error) {
    console.error('[MySQL] Error updating product:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Product deleted successfully from MySQL'
    });
  } catch (error) {
    console.error('[MySQL] Error deleting product:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
