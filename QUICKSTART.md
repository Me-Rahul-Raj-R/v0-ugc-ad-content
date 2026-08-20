# 🎬 UGC Ad Content Studio - Quick Start Guide

**AI-Powered UGC Ad Creation System with MySQL Workbench Database & Modern React Frontend**

---

## 🐬 MySQL Database & Workbench Setup

### Step 1: Verify MySQL is Running
1. Open **MySQL Workbench**.
2. Connect to your local instance (Default: `127.0.0.1:3306`, User: `root`).
3. *(Optional)* You can open and run [`database/schema.sql`](file:///c:/Users/Rahul%20Raj%20R/OneDrive/Documents/Project%20ex/UGC/v0-ugc-ad-content/database/schema.sql) directly in MySQL Workbench, or let the backend automatically create the `ugc_ads_db` database and all tables for you on startup!

### Step 2: Configure Database Credentials
Edit [`backend/.env`](file:///c:/Users/Rahul%20Raj%20R/OneDrive/Documents/Project%20ex/UGC/v0-ugc-ad-content/backend/.env):
```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=ugc_ads_db
```
*(If your MySQL root user has no password, keep `DB_PASSWORD=` empty)*.

---

## 🚀 Running the Application

### Option A: Run Both Backend & Frontend in One Command (Recommended)
From the root directory:
```bash
npm start
```

### Option B: Run in Separate Terminals

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```
*Backend runs on `http://localhost:5000` and initializes the MySQL database `ugc_ads_db`.*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```
*Frontend opens automatically on `http://localhost:3000`.*

---

## 🎯 How to Use the Studio

1. **📦 Product Setup**:
   - Add your D2C brand details (Name, price, pain points, USPs).
   - Saved automatically to the `products` table in MySQL.

2. **🎣 Viral Hook Generator**:
   - Pick from 6 psychological frameworks (Frustration, Skeptic Confession, Pattern Interrupt, Curiosity, Transformation, Controversy).
   - 1-click copy or 1-click save to the `hooks` table in MySQL.

3. **📝 Script Studio & Teleprompter**:
   - Generate structured 5-part video scripts with visual & audio directions.
   - Click **📺 Open Teleprompter** to rehearse your script with auto-scrolling speed control!
   - Download as `.md` or save to the `scripts` table in MySQL.

4. **📢 CTA Vault**:
   - Generate high-converting Soft, Curiosity, Discount, or Direct CTAs.
   - Saved to the `ctas` table in MySQL.

5. **🤖 AI Prompt Matrix**:
   - Ready-to-use master prompts with dynamic variable injection for ChatGPT-4o, Claude 3.5, and Gemini.

6. **📊 MySQL Campaign Vault**:
   - View, search, and manage all assets stored in MySQL Workbench.
   - Export full Campaign Brief as Markdown (`.md`), JSON, or CSV spreadsheet.

---

## 🐬 Verifying in MySQL Workbench

Run these queries in MySQL Workbench to see your live data:
```sql
USE ugc_ads_db;

-- View Products
SELECT * FROM products;

-- View Saved Viral Hooks
SELECT * FROM hooks;

-- View UGC Video Scripts
SELECT * FROM scripts;

-- View Calls to Action
SELECT * FROM ctas;
```

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend server health status |
| `GET` | `/api/db-status` | Real-time MySQL connection & statistics |
| `GET` | `/api/products` | Get all products from MySQL |
| `POST` | `/api/products` | Create a new product in MySQL |
| `DELETE` | `/api/products/:id` | Delete product from MySQL |
| `GET` | `/api/hooks/product/:id` | Get hooks for product from MySQL |
| `POST` | `/api/hooks` | Save hook to MySQL |
| `GET` | `/api/scripts/product/:id`| Get scripts for product from MySQL |
| `POST` | `/api/scripts` | Save script to MySQL |
| `GET` | `/api/ctas/product/:id` | Get CTAs for product from MySQL |
| `POST` | `/api/ctas` | Save CTA to MySQL |
| `GET` | `/api/prompts` | AI Prompt templates |
