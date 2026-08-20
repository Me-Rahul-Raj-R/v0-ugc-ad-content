// Hooks API Route (MySQL)
const express = require('express');
const { getPool } = require('../config/db');

const router = express.Router();

function formatHook(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    productId: row.product_id,
    hookType: row.hook_type,
    content: row.content,
    wordCount: row.word_count || (row.content ? row.content.trim().split(/\s+/).length : 0),
    platform: row.platform || 'instagram',
    tone: row.tone || 'authentic',
    isFavorite: !!row.is_favorite,
    createdAt: row.created_at
  };
}

// Create hook
router.post('/', async (req, res) => {
  try {
    const { productId, hookType, content, platform, tone } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Hook content is required'
      });
    }

    const pool = getPool();
    const wordCount = content.trim().split(/\s+/).length;

    const [result] = await pool.query(
      `INSERT INTO hooks (product_id, hook_type, content, word_count, platform, tone)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [productId || null, hookType || 'general', content, wordCount, platform || 'instagram', tone || 'authentic']
    );

    const [rows] = await pool.query('SELECT * FROM hooks WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Hook saved successfully in MySQL',
      data: formatHook(rows[0])
    });
  } catch (error) {
    console.error('[MySQL] Error creating hook:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get hooks by product
router.get('/product/:productId', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM hooks WHERE product_id = ? ORDER BY created_at DESC', [req.params.productId]);

    res.json({
      success: true,
      count: rows.length,
      data: rows.map(formatHook)
    });
  } catch (error) {
    console.error('[MySQL] Error fetching hooks by product:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get hooks by type
router.get('/type/:hookType', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM hooks WHERE hook_type = ? ORDER BY created_at DESC', [req.params.hookType]);

    res.json({
      success: true,
      count: rows.length,
      data: rows.map(formatHook)
    });
  } catch (error) {
    console.error('[MySQL] Error fetching hooks by type:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Toggle Favorite / Delete Hook
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    await pool.query('DELETE FROM hooks WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Hook deleted from MySQL'
    });
  } catch (error) {
    console.error('[MySQL] Error deleting hook:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all hooks
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM hooks ORDER BY created_at DESC');

    res.json({
      success: true,
      count: rows.length,
      data: rows.map(formatHook)
    });
  } catch (error) {
    console.error('[MySQL] Error fetching all hooks:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
