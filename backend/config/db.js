// MySQL Database Connection and Auto-initialization
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ugc_ads_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

let pool = null;

/**
 * Initialize MySQL Database:
 * 1. Connect without database name to ensure the database exists.
 * 2. Create the target database if it does not exist.
 * 3. Create pool for the target database.
 * 4. Run CREATE TABLE scripts.
 * 5. Insert initial seed data if tables are empty.
 */
async function initializeDatabase() {
  try {
    // Step 1: Connect to MySQL server root
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    // Step 2: Create database if not exists
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await tempConnection.end();

    // Step 3: Create connection pool to the specific database
    pool = mysql.createPool(dbConfig);

    // Step 4: Create tables
    await createTables();

    // Step 5: Seed initial data if tables are empty
    await seedInitialData();

    console.log(`[MySQL] Successfully connected to MySQL Workbench database: ${dbConfig.database} on ${dbConfig.host}:${dbConfig.port}`);
    return pool;
  } catch (error) {
    console.error('[MySQL Error] Could not connect to MySQL server:', error.message);
    console.error('Check your MySQL Workbench connection settings (host: 127.0.0.1, port: 3306, user: root, password in backend/.env).');
    
    // Fallback: create pool anyway so that routes can return proper error JSON rather than crashing server
    pool = mysql.createPool(dbConfig);
    return pool;
  }
}

async function createTables() {
  // Products table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(50) NOT NULL DEFAULT 'd2c',
      price VARCHAR(50) DEFAULT '₹0',
      age_range VARCHAR(50) DEFAULT '20-35',
      gender VARCHAR(50) DEFAULT 'All',
      region VARCHAR(100) DEFAULT 'India',
      pain_points JSON DEFAULT NULL,
      usp JSON DEFAULT NULL,
      platforms JSON DEFAULT NULL,
      brand_tone VARCHAR(100) DEFAULT 'honest, friendly',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Hooks table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hooks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NULL,
      hook_type VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      word_count INT DEFAULT 0,
      platform VARCHAR(50) DEFAULT 'instagram',
      tone VARCHAR(100) DEFAULT 'authentic',
      is_favorite BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Scripts table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS scripts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NULL,
      title VARCHAR(255) NOT NULL,
      duration VARCHAR(50) DEFAULT '30-sec',
      hook TEXT NOT NULL,
      problem TEXT NOT NULL,
      discovery TEXT NOT NULL,
      result TEXT NOT NULL,
      cta TEXT NOT NULL,
      visual_cues TEXT NULL,
      audio_cues TEXT NULL,
      platform VARCHAR(50) DEFAULT 'instagram',
      tone VARCHAR(100) DEFAULT 'authentic, casual',
      language VARCHAR(50) DEFAULT 'casual-english',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // CTAs table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ctas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NULL,
      cta_type VARCHAR(50) NOT NULL DEFAULT 'soft',
      content TEXT NOT NULL,
      platform VARCHAR(50) DEFAULT 'instagram',
      tone VARCHAR(100) DEFAULT 'friendly, optional',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Prompt templates table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS prompt_templates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      template_key VARCHAR(100) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT,
      template TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

async function seedInitialData() {
  const [productRows] = await pool.query('SELECT COUNT(*) as count FROM products');
  if (productRows[0].count === 0) {
    console.log('[MySQL] Seeding default products, hooks, and scripts...');
    
    // Seed Product
    const [result] = await pool.query(`
      INSERT INTO products (name, description, category, price, age_range, gender, region, pain_points, usp, platforms, brand_tone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'FolliBoost Scalp Serum',
      'Natural scalp-activating serum with Redensyl & Rosemary that reduces hair fall and boosts density in 21 days.',
      'd2c',
      '₹699',
      '20-35',
      'Men & Women',
      'India',
      JSON.stringify(['Excessive hair fall in shower', 'Greasy heavy oils clog pores', 'Thinning front hairline']),
      JSON.stringify(['Visible results in 21 days', 'Non-sticky water-based formula', 'Clinically proven actives + Ayurvedic herbs']),
      JSON.stringify(['instagram', 'youtube', 'facebook']),
      'honest, relatable, empathetic'
    ]);

    const seededProductId = result.insertId;

    // Seed Hooks
    await pool.query(`
      INSERT INTO hooks (product_id, hook_type, content, word_count, platform, tone)
      VALUES 
      (?, 'frustration', 'Every shower meant another handful of hair lost', 8, 'instagram', 'relatable'),
      (?, 'confession', 'I honestly thought this serum was another Instagram scam', 9, 'instagram', 'honest'),
      (?, 'pattern-break', 'Stop putting heavy sticky oils on your scalp overnight', 9, 'instagram', 'direct'),
      (?, 'transformation', 'This is my hairline density after exactly 3 weeks', 9, 'instagram', 'inspiring')
    `, [seededProductId, seededProductId, seededProductId, seededProductId]);

    // Seed Script
    await pool.query(`
      INSERT INTO scripts (product_id, title, duration, hook, problem, discovery, result, cta, visual_cues, audio_cues, platform, tone, language)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      seededProductId,
      '30s Bathroom Routine UGC Ad',
      '30-sec',
      'Every morning my comb had so much hair on it, I was scared to brush.',
      'I tried every expensive shampoo and sticky onion oil, but nothing helped and my scalp just got oily.',
      'Then I found FolliBoost. It is super lightweight, water-based, and has Redensyl and Rosemary.',
      'Within 3 weeks of applying 3 drops before bed, my hair fall reduced by almost 80%.',
      'If hair fall stresses you out every day, give this a try — link is right below.',
      '[0:00-0:05 Close-up selfie holding hair brush looking worried]\n[0:05-0:12 B-roll of old greasy hair oils]\n[0:12-0:20 Applying 3 drops of FolliBoost directly onto scalp]\n[0:20-0:25 Smiling touching thick voluminous hair]\n[0:25-0:30 Pointing at screen with FolliBoost bottle]',
      'Soft upbeat acoustic background under clear selfie voiceover',
      'instagram',
      'authentic, casual',
      'casual-english'
    ]);

    // Seed CTAs
    await pool.query(`
      INSERT INTO ctas (product_id, cta_type, content, platform, tone)
      VALUES 
      (?, 'soft', 'If hair fall is bothering you, you can check it out below.', 'instagram', 'friendly, optional'),
      (?, 'soft', 'Just sharing what helped me — link is in the bio!', 'instagram', 'casual'),
      (?, 'medium', 'Give it 3 weeks and see how your scalp feels.', 'instagram', 'encouraging'),
      (?, 'direct', 'Tap below to claim the 20% off starter bundle.', 'instagram', 'action-oriented')
    `, [seededProductId, seededProductId, seededProductId, seededProductId]);
  }
}

function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

module.exports = {
  initializeDatabase,
  getPool,
  dbConfig
};
