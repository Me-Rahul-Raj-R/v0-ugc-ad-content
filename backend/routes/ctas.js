// CTA API Route (MySQL)
const express = require('express');
const { getPool } = require('../config/db');

const router = express.Router();

function formatCTA(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    productId: row.product_id,
    ctaType: row.cta_type,
    content: row.content,
    platform: row.platform || 'instagram',
    tone: row.tone || 'friendly, optional',
    createdAt: row.created_at
  };
}

// Create CTA
router.post('/', async (req, res) => {
  try {
    const { productId, ctaType, content, platform, tone } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'CTA content is required'
      });
    }

    const pool = getPool();
    const [result] = await pool.query(
      `INSERT INTO ctas (product_id, cta_type, content, platform, tone)
       VALUES (?, ?, ?, ?, ?)`,
      [productId || null, ctaType || 'soft', content, platform || 'instagram', tone || 'friendly, optional']
    );

    const [rows] = await pool.query('SELECT * FROM ctas WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'CTA saved successfully in MySQL',
      data: formatCTA(rows[0])
    });
  } catch (error) {
    console.error('[MySQL] Error creating CTA:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get CTAs by product
router.get('/product/:productId', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM ctas WHERE product_id = ? ORDER BY created_at DESC', [req.params.productId]);

    res.json({
      success: true,
      count: rows.length,
      data: rows.map(formatCTA)
    });
  } catch (error) {
    console.error('[MySQL] Error fetching CTAs by product:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all CTAs
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM ctas ORDER BY created_at DESC');

    res.json({
      success: true,
      count: rows.length,
      data: rows.map(formatCTA)
    });
  } catch (error) {
    console.error('[MySQL] Error fetching all CTAs:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete CTA
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    await pool.query('DELETE FROM ctas WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'CTA deleted from MySQL'
    });
  } catch (error) {
    console.error('[MySQL] Error deleting CTA:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
