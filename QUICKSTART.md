# Quick Start Guide - UGC Ad Generator

**Get running in 5 minutes**

---

## 📦 Installation

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm start
```

### 3. Open Browser
```
http://localhost:3000
```

---

## 🎯 First Steps

### Step 1: Create Product
1. Go to "Product Setup" tab
2. Enter product name: "Hair Growth Serum"
3. Fill in details
4. Click "Create Product"

### Step 2: Generate Hooks
1. Go to "Hooks" tab
2. Select hook type: "frustration"
3. Click "Generate Hooks"
4. See 15+ variations

### Step 3: Generate Scripts
1. Go to "Scripts" tab
2. Select script type: "30-sec"
3. Click "Generate Script"
4. See full script with Hook → Problem → Result → CTA

### Step 4: Generate CTAs
1. Go to "CTAs" tab
2. Select CTA type: "soft"
3. Click "Generate CTAs"
4. See 10 CTA options

### Step 5: Export
1. Go to "Output" tab
2. Click "Export as JSON" or "Export as Markdown"
3. Download content pack

---

## 📡 Key Endpoints

```
POST   /api/products              Create product
GET    /api/products              Get all products
POST   /api/hooks                 Create hook
GET    /api/hooks/product/:id     Get hooks
POST   /api/scripts               Create script
GET    /api/scripts/product/:id   Get scripts
POST   /api/ctas                  Create CTA
GET    /api/ctas/product/:id      Get CTAs
GET    /api/prompts               Get prompt templates
```

---

## 🎬 Sample Output

### Hook
> "My hair fall was getting scary"

### Script
```
[HOOK] "My hair fall was getting scary"
[PROBLEM] "I was tired of losing hair every day"
[DISCOVERY] "Then I tried this serum for 2-3 weeks"
[RESULT] "My hair started feeling stronger"
[CTA] "If hair fall bothers you, check it out"
```

### CTA
> "Just sharing what helped me"

---

## 🔧 Troubleshooting

| Error | Fix |
|-------|-----|
| Port 5000 in use | Change PORT in .env |
| MongoDB error | Install MongoDB or use Atlas |
| CORS error | Ensure cors() in server.js |
| Module not found | Run npm install in folder |

---

## 📚 Documentation

- **README.md** - Full project overview
- **docs/prompt-logic.md** - How prompts work
- **docs/API.md** - All endpoints
- **docs/SAMPLE-OUTPUTS.md** - Real examples
- **SUBMISSION.md** - How to submit

---

## ⭐ Pro Tips

1. **Save Hooks First** - Generate them, save to DB
2. **Test Different Hook Types** - See which converts best
3. **Export Everything** - Keep JSON backups
4. **Try Multiple Products** - Test system scalability
5. **Share on Social** - Post your scripts on Instagram

---

## 🚀 Next Steps

1. ✅ Get system running
2. ✅ Create product example
3. ✅ Generate content
4. ✅ Export pack
5. ✅ Share on social media
6. ✅ Submit to Future Interns

---

**That's it! You're ready to generate high-converting UGC ads 🎬**

*Need help? Check docs/ folder or email contact@futureinterns.com*
