-- UGC Ad Generator Database Schema
-- Compatible with MySQL 8.0+ / MySQL Workbench
-- Default Database: ugc_ads_db

CREATE DATABASE IF NOT EXISTS ugc_ads_db;
USE ugc_ads_db;

-- 1. Products Table
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

-- 2. Hooks Table
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

-- 3. UGC Scripts Table
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

-- 4. CTAs Table
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

-- 5. Prompt Templates Table
CREATE TABLE IF NOT EXISTS prompt_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_key VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Sample Initial Seed Data for Instant MySQL Workbench Testing
-- ============================================================

-- Seed Products
INSERT INTO products (id, name, description, category, price, age_range, gender, region, pain_points, usp, platforms, brand_tone)
VALUES 
(1, 'FolliBoost Hair Growth Serum', 'An all-natural scalp activating serum with Rosemary and Redensyl that reduces hair fall in 21 days without sticky residue.', 'd2c', '₹699', '20-35', 'Men & Women', 'India', '["Excessive hair fall in shower", "Thinning hairline", "Greasy sticky oils"]', '["Visible results in 21 days", "Water-based & non-sticky", "100% natural Ayurvedic + scientific actives"]', '["instagram", "facebook", "youtube"]', 'honest, relatable, empathetic'),
(2, 'GlowDrop Vitamin C Gel', 'Ultra-lightweight antioxidant gel that fades dark spots and gives an all-day natural skin glow.', 'd2c', '₹499', '18-30', 'All', 'India', '["Dull uneven skin", "Dark acne spots", "Heavy creams cause breakouts"]', '["3x faster absorption", "Fragrance-free & dermatologist tested", "Visible glow in 14 days"]', '["instagram", "tiktok"]', 'vibrant, friendly')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Seed Hooks
INSERT INTO hooks (product_id, hook_type, content, word_count, platform, tone)
VALUES 
(1, 'frustration', 'Every morning my pillow looked like a crime scene', 9, 'instagram', 'raw, authentic'),
(1, 'confession', 'I honestly thought this serum was another scam', 8, 'instagram', 'honest'),
(1, 'pattern-break', 'Stop using heavy sticky hair oils every night', 8, 'instagram', 'direct'),
(1, 'transformation', 'This is my hair density after exactly 30 days', 9, 'instagram', 'inspirational'),
(2, 'curiosity', 'The one skincare ingredient nobody talks about enough', 8, 'instagram', 'intriguing')
ON DUPLICATE KEY UPDATE content=VALUES(content);

-- Seed Scripts
INSERT INTO scripts (product_id, title, duration, hook, problem, discovery, result, cta, visual_cues, audio_cues, platform, tone, language)
VALUES 
(1, '30s Honest Bathroom Routine UGC', '30-sec', 
'Every shower was a nightmare because clumps of hair kept falling out.',
'I tried every popular onion oil and salon treatment, but my scalp just felt greasy and irritated.',
'Then my dermatologist friend mentioned FolliBoost — it uses water-based Redensyl and Rosemary.',
'Within 3 weeks, my comb had literally 80% less hair, and my baby hairs started sprouting back.',
'If hair fall stresses you out every morning, check the link below — it actually works.',
'[0:00-0:05 Close-up selfie in bathroom holding comb, looking frustrated]\n[0:05-0:12 B-roll of old heavy hair oil bottles on shelf]\n[0:12-0:20 Applying 3 drops of FolliBoost directly to clean scalp]\n[0:20-0:25 Smiling showing thick bouncy roots in natural sunlight]\n[0:25-0:30 Pointing at screen with product bottle in hand]',
'Soft lo-fi acoustic background music under authentic conversational voiceover',
'instagram', 'authentic, conversational', 'casual-english')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Seed CTAs
INSERT INTO ctas (product_id, cta_type, content, platform, tone)
VALUES 
(1, 'soft', 'If hair fall is stressing you out, you can check it out below.', 'instagram', 'friendly, optional'),
(1, 'soft', 'Just sharing what actually worked for me, link is below!', 'instagram', 'casual'),
(1, 'medium', 'Give it a try for 3 weeks and see if your scalp feels different.', 'instagram', 'encouraging'),
(1, 'direct', 'Tap the link to get 15% off your first bottle today.', 'instagram', 'action-oriented')
ON DUPLICATE KEY UPDATE content=VALUES(content);
