// UGC Scripts API Route (MySQL)
const express = require('express');
const { getPool } = require('../config/db');

const router = express.Router();

function formatScript(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    productId: row.product_id,
    title: row.title,
    duration: row.duration || '30-sec',
    script: {
      hook: row.hook,
      problem: row.problem,
      discovery: row.discovery,
      result: row.result,
      cta: row.cta,
      visualCues: row.visual_cues || '',
      audioCues: row.audio_cues || ''
    },
    platform: row.platform || 'instagram',
    tone: row.tone || 'authentic, casual',
    language: row.language || 'casual-english',
    createdAt: row.created_at
  };
}

// Create script
router.post('/', async (req, res) => {
  try {
    const { productId, scriptType, title, script, platform, tone, language, visualCues, audioCues } = req.body;

    const pool = getPool();
    const duration = scriptType || script?.duration || '30-sec';
    const hook = script?.hook || '';
    const problem = script?.problem || '';
    const discovery = script?.discovery || '';
    const resultText = script?.result || '';
    const cta = script?.cta || '';
    const visual = visualCues || script?.visualCues || '';
    const audio = audioCues || script?.audioCues || '';

    const [insertResult] = await pool.query(
      `INSERT INTO scripts (product_id, title, duration, hook, problem, discovery, result, cta, visual_cues, audio_cues, platform, tone, language)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId || null,
        title || `${duration} UGC Ad Script`,
        duration,
        hook,
        problem,
        discovery,
        resultText,
        cta,
        visual,
        audio,
        platform || 'instagram',
        tone || 'authentic, casual',
        language || 'casual-english'
      ]
    );

    const [rows] = await pool.query('SELECT * FROM scripts WHERE id = ?', [insertResult.insertId]);

    res.status(201).json({
      success: true,
      message: 'UGC script saved successfully in MySQL',
      data: formatScript(rows[0])
    });
  } catch (error) {
    console.error('[MySQL] Error creating script:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get scripts by product
router.get('/product/:productId', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM scripts WHERE product_id = ? ORDER BY created_at DESC', [req.params.productId]);

    res.json({
      success: true,
      count: rows.length,
      data: rows.map(formatScript)
    });
  } catch (error) {
    console.error('[MySQL] Error fetching scripts by product:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all scripts
router.get('/', async (req, res) => {
  try {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM scripts ORDER BY created_at DESC');

    res.json({
      success: true,
      count: rows.length,
      data: rows.map(formatScript)
    });
  } catch (error) {
    console.error('[MySQL] Error fetching all scripts:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete script
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool();
    await pool.query('DELETE FROM scripts WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Script deleted from MySQL'
    });
  } catch (error) {
    console.error('[MySQL] Error deleting script:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
