# UGC Ad Generator - AI-Powered Content Marketing System

> **Professional UGC Ad Content Generation System built with AI Prompts, React, Node.js, and MongoDB**

![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![License](https://img.shields.io/badge/License-MIT-blue)
![Made for](https://img.shields.io/badge/Made%20For-Future%20Interns%20Task%202-purple)

## 🎯 Task 2 Objective

This system demonstrates **how to turn AI into a repeatable marketing engine** for generating high-converting UGC (User Generated Content) ad scripts using structured prompts and prompt engineering principles.

**Key Skills Demonstrated:**
- ✅ AI-driven content marketing
- ✅ UGC ad scripting (15-45 sec videos)
- ✅ Multi-hook generation for A/B testing
- ✅ Problem-solution-CTA conversion framework
- ✅ Platform-specific content adaptation
- ✅ Prompt engineering (role-based, constraint-based)
- ✅ Full-stack implementation (React + Node + MongoDB)

---

## 🚀 Features

### 1. **Product Intelligence Module**
- Analyze D2C products or local businesses
- Extract pain points & emotional triggers
- Identify USPs and conversion angles

### 2. **Hook Generator**
Generate scroll-stopping hooks in 5 categories:
- **Frustration Hook** - "I was tired of..."
- **Confession Hook** - "I didn't expect..."
- **Curiosity Hook** - "No one talks about..."
- **Pattern Break Hook** - "This is not an ad"
- **Transformation Hook** - "After 30 days..."

### 3. **UGC Script Generator**
Create authentic 30-second video scripts:
- Hook (first 2-3 seconds)
- Personal problem
- Discovery moment
- Results/benefits
- Soft CTA

### 4. **Soft CTA Generator**
Generate non-pushy calls-to-action:
- Optional, friend-like tone
- Trust-based messaging
- Platform-specific variations

### 5. **Content Pack Export**
- Export as JSON
- Export as Markdown
- Ready for marketing teams
- Directly usable in ads

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - Interactive UI
- **CSS3** - Modern styling
- **Axios** - API communication

### Backend
- **Node.js + Express** - REST API
- **MongoDB** - Content storage
- **Mongoose** - Database modeling

### Architecture
```
UGC-Ad-Generator/
├── frontend/                  # React UI
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
├── backend/                   # Node.js API
│   ├── models/               # MongoDB schemas
│   ├── routes/               # API endpoints
│   ├── server.js
│   └── package.json
├── docs/                     # Documentation
│   ├── prompt-logic.md
│   ├── api-docs.md
│   └── sample-outputs.md
└── README.md
```

---

## 📋 Prompt Engineering Logic

### Why Structured Prompts Work

**Traditional approach:** "Write an ad script"
→ Generic, sales-y, unconvincing

**Prompt engineering approach:** Use constraints + role-based prompting
→ Specific, authentic, converting

#### Key Prompt Principles Used

1. **Role-Based Prompting**
   ```
   "You are a real customer filming a selfie-style video at home..."
   ```
   Makes AI adopt authentic voice

2. **Constraint-Based Prompting**
   ```
   "Rules:
   - Max 10 words
   - Casual language
   - No brand hype
   - First-person language"
   ```
   Reduces generic output

3. **Structure Enforcement**
   ```
   "Write using this structure:
   1. Hook
   2. Problem
   3. Discovery
   4. Result
   5. CTA"
   ```
   Ensures conversion psychology

4. **Tone Control**
   ```
   "Tone: Honest, imperfect, friend-like"
   ```
   Maintains UGC authenticity

---

## 🎬 Example Output

### Product: Hair Growth Serum

#### Generated Hook
> "My hair fall was getting scary"

#### Full 30-Second Script
```
[HOOK]
"My hair fall was getting scary"

[PROBLEM]
"I was honestly tired of losing hair every day. The stress made it worse."

[DISCOVERY]
"Then I started using this serum consistently for about 2-3 weeks."

[RESULT]
"And honestly? My hair started feeling stronger. Less hair on my pillow now."

[CTA]
"If hair fall bothers you too, you can check it out."
```

#### Generated CTAs
- "Just sharing what helped me"
- "You can try it if you want"
- "Worked for me, might help you"

---

## 🏃 Quick Start

### Prerequisites
- Node.js 14+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/ugc-ad-generator
   cd ugc-ad-generator
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file
   echo "MONGODB_URI=mongodb://localhost:27017/ugc-ads" > .env
   echo "PORT=5000" >> .env
   
   npm run dev
   ```

3. **Frontend Setup** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the app**
   - Frontend: http://localhost:3000
   - API: http://localhost:5000/api

---

## 📡 API Endpoints

### Products
```
POST   /api/products              # Create product
GET    /api/products              # Get all products
GET    /api/products/:id          # Get one product
PUT    /api/products/:id          # Update product
DELETE /api/products/:id          # Delete product
```

### Hooks
```
POST   /api/hooks                 # Create hook
GET    /api/hooks                 # Get all hooks
GET    /api/hooks/product/:id     # Get hooks by product
GET    /api/hooks/type/:type      # Get hooks by type
```

### Scripts
```
POST   /api/scripts               # Create script
GET    /api/scripts               # Get all scripts
GET    /api/scripts/product/:id   # Get scripts by product
PUT    /api/scripts/:id           # Update script
```

### CTAs
```
POST   /api/ctas                  # Create CTA
GET    /api/ctas                  # Get all CTAs
GET    /api/ctas/product/:id      # Get CTAs by product
```

### Prompts
```
GET    /api/prompts               # Get all prompt templates
GET    /api/prompts/:id           # Get specific prompt
```

---

## 💡 How This Solves Real Marketing Problems

### Problem 1: Manual Ad Writing Takes Time
**Solution:** AI generates 100+ hook variations in seconds

### Problem 2: Inconsistent Tone Across Ads
**Solution:** Prompts enforce UGC authenticity at scale

### Problem 3: A/B Testing is Expensive
**Solution:** Generate multiple variations cheaply to test

### Problem 4: Hard to Scale for Multiple Brands
**Solution:** Reusable prompt system works for any D2C product

---

## 📊 Workflow Example: D2C Hair Serum

1. **Input Product Details**
   - Name: Hair Growth Serum
   - Price: ₹699
   - Target: Women 22-35 (India)
   - Pain: Hair fall, thinning, stress

2. **Generate Hooks** (15+ variations)
   - Frustration: "My hair fall was getting scary"
   - Confession: "I didn't expect this to work"
   - Curiosity: "No one talks about stress hair loss"

3. **Generate Scripts** (Multiple hook types)
   - 30-second scripts for Instagram
   - 15-second scripts for Reels
   - Long-form for YouTube

4. **Generate CTAs** (3 types: soft, medium, direct)
   - Soft: "Just sharing what helped me"
   - Medium: "Worth trying if you have this problem"
   - Direct: "Get yours today"

5. **Export Pack**
   - JSON file for database storage
   - Markdown for documentation
   - Ready to send to video creators

---

## 🎓 Learning Path

### For Beginners
1. Understand what UGC ads are
2. Learn 5 hook types
3. Practice creating 1 script

### For Intermediate
1. Understand prompt constraints
2. Create product intelligence analysis
3. Generate 20+ hooks for testing

### For Advanced
1. Build your own prompt system
2. Integrate with ChatGPT API
3. Create client-ready packages

---


## 📞 Support & Contact

- **GitHub Issues:** [Create issue](https://github.com/yourrepo/issues)
- **Email:** contact@futureinterns.com
- **Instagram:** [@future_interns](https://instagram.com/future_interns)

---

## 📝 License

MIT License - Free for educational and commercial use

---

## ✨ Credits

Built for **Future Interns Task 2** - AI Content Marketing using UGC Ads

**By:** Prompt Engineering Team  
**Date:** January 2026

---

## 🎯 Next Steps

- [ ] Integrate ChatGPT API for AI generation
- [ ] Add video script visualization
- [ ] Create marketplace for UGC creators
- [ ] Add A/B testing analytics
- [ ] Build client dashboard

**Star ⭐ this repo if it helped you!**
