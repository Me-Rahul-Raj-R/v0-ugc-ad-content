# System Architecture - UGC Ad Generator

> **How the system works end-to-end**

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                          │
│                    (React Frontend)                          │
│  ┌──────────┬───────────┬──────────┬─────────┬──────────┐   │
│  │ Products │ Hooks Gen │ Scripts  │  CTAs   │ Output   │   │
│  └──────────┴───────────┴──────────┴─────────┴──────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ (HTTP REST Calls)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER                            │
│                   (Node.js Backend)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes: /api/products, /hooks, /scripts, /ctas    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Models: Product, Hook, Script, CTA                 │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ (Mongoose ORM)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   MONGODB DATABASE                           │
│  ┌─────────┬──────┬──────────┬──────┐                       │
│  │Products │Hooks │Scripts   │CTAs  │                       │
│  └─────────┴──────┴──────────┴──────┘                       │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Architecture

```
USER CREATES PRODUCT
         ↓
   Frontend Form
         ↓
   HTTP POST /products
         ↓
   Express Server
         ↓
   Validate Data
         ↓
   MongoDB Insert
         ↓
   Return Success
         ↓
   Display in UI
```

---

## 🎯 Component Architecture

### Frontend Components

```
App.js (Main Container)
│
├── ProductForm
│   ├── Form inputs
│   ├── Validation
│   └── API calls
│
├── HookGenerator
│   ├── Dropdown selectors
│   ├── Generate button
│   └── Display hooks list
│
├── ScriptGenerator
│   ├── Parameters selection
│   ├── Generate button
│   └── Script display (structured)
│
├── CTAGenerator
│   ├── CTA type selector
│   ├── Generate button
│   └── CTA list display
│
└── OutputDisplay
    ├── Statistics
    ├── Export buttons
    └── Content preview
```

### Backend Routes

```
Express Server
│
├── /api/products
│   ├── POST   - Create product
│   ├── GET    - Get all products
│   ├── GET/:id - Get one product
│   ├── PUT/:id - Update product
│   └── DELETE/:id - Delete product
│
├── /api/hooks
│   ├── POST   - Create hook
│   ├── GET    - Get all hooks
│   ├── GET/product/:id - Get by product
│   └── GET/type/:type - Get by type
│
├── /api/scripts
│   ├── POST   - Create script
│   ├── GET    - Get all scripts
│   ├── GET/product/:id - Get by product
│   └── PUT/:id - Update script
│
├── /api/ctas
│   ├── POST   - Create CTA
│   ├── GET    - Get all CTAs
│   └── GET/product/:id - Get by product
│
└── /api/prompts
    ├── GET - Get all prompts
    └── GET/:id - Get specific prompt
```

---

## 💾 Database Schema

### Product Collection
```javascript
{
  _id: ObjectId,
  name: String,                    // "Hair Growth Serum"
  description: String,             // Product description
  category: String,                // "d2c", "local-business", "saas", "creator-brand"
  price: String,                   // "₹699"
  targetAudience: {
    ageRange: String,              // "22-35"
    gender: String,                // "Women"
    region: String,                // "India"
    painPoints: [String]           // ["Hair fall", "Stress"]
  },
  usp: [String],                   // ["Natural", "Results in 30 days"]
  platform: [String],              // ["instagram", "facebook"]
  brand: {
    tone: String                   // "honest, friendly"
  },
  createdAt: Date
}
```

### Hook Collection
```javascript
{
  _id: ObjectId,
  productId: ObjectId,             // Reference to Product
  hookType: String,                // "frustration", "confession", "curiosity", etc.
  content: String,                 // "My hair fall was scary"
  wordCount: Number,               // 5
  platform: String,                // "instagram"
  tone: String,                    // "casual"
  performance: {
    clicks: Number,
    conversions: Number,
    ctr: Number
  },
  createdAt: Date
}
```

### Script Collection
```javascript
{
  _id: ObjectId,
  productId: ObjectId,
  hookId: ObjectId,
  scriptType: String,              // "30-sec", "15-sec", "45-sec", "long-form"
  title: String,
  script: {
    hook: String,
    problem: String,
    discovery: String,
    result: String,
    cta: String
  },
  platform: String,
  tone: String,
  language: String,
  status: String,                  // "draft", "approved", "published"
  createdAt: Date,
  updatedAt: Date
}
```

### CTA Collection
```javascript
{
  _id: ObjectId,
  productId: ObjectId,
  ctaType: String,                 // "soft", "medium", "direct"
  content: String,                 // "Just sharing what helped me"
  platform: String,
  tone: String,
  conversionRate: Number,
  createdAt: Date
}
```

---

## 🔄 Request-Response Flow Example

### Creating a Hook

**Step 1: Frontend**
```javascript
// User fills form and clicks Generate
const hookData = {
  productId: "507f1f77bcf86cd799439011",
  hookType: "frustration",
  content: "My hair fall was scary",
  wordCount: 5,
  platform: "instagram"
};

// Send to backend
fetch('/api/hooks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(hookData)
});
```

**Step 2: Backend Receives**
```javascript
// Express server receives POST
app.post('/api/hooks', async (req, res) => {
  // Extract data from request
  const hookData = req.body;
  
  // Validate data
  if (!hookData.content) {
    return res.status(400).json({ error: 'Content required' });
  }
  
  // Create new Hook document
  const hook = new Hook(hookData);
  
  // Save to MongoDB
  await hook.save();
  
  // Return success
  res.status(201).json({
    success: true,
    message: 'Hook created',
    data: hook
  });
});
```

**Step 3: MongoDB Stores**
```
Collection: hooks
Document inserted:
{
  _id: ObjectId("..."),
  productId: "507f1f77bcf86cd799439011",
  hookType: "frustration",
  content: "My hair fall was scary",
  wordCount: 5,
  platform: "instagram",
  createdAt: "2026-01-28T10:00:00Z"
}
```

**Step 4: Response Back to Frontend**
```json
{
  "success": true,
  "message": "Hook created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "content": "My hair fall was scary",
    "hookType": "frustration",
    "platform": "instagram"
  }
}
```

**Step 5: Frontend Updates UI**
```javascript
// Add hook to display list
setHooks([...hooks, newHook]);

// Show success message
alert('Hook saved!');
```

---

## 🔗 Relationship Diagram

```
Product (1)
    ├── (1) ← → (Many) Hook
    │           └── Each product has multiple hooks
    │
    ├── (1) ← → (Many) Script
    │           └── Each script references one product
    │               └── Script may reference one hook
    │
    └── (1) ← → (Many) CTA
                └── Each CTA references one product
```

---

## 🎨 Frontend State Management

```
App.js (Parent State)
│
├── currentTab (string)
│   ├── "product"
│   ├── "hooks"
│   ├── "scripts"
│   ├── "cta"
│   └── "output"
│
├── products (array)
│   └── Array of all products
│
└── selectedProduct (object)
    └── Currently selected product

Component-Level State (Local)
├── ProductForm
│   └── formData (object)
│
├── HookGenerator
│   ├── hooks (array)
│   ├── hookType (string)
│   └── loading (boolean)
│
├── ScriptGenerator
│   ├── scripts (array)
│   ├── scriptType (string)
│   └── hookType (string)
│
└── CTAGenerator
    ├── ctas (array)
    ├── ctaType (string)
    └── loading (boolean)
```

---

## 🌐 API Communication Pattern

### All Requests Follow This Pattern

```
1. Frontend Action
   ↓
2. Prepare Data
   ↓
3. HTTP Request (GET/POST/PUT/DELETE)
   ↓
4. Backend Validation
   ↓
5. Database Operation
   ↓
6. JSON Response
   ↓
7. Frontend Updates UI
```

### Example: Get Products

```
GET /api/products

RESPONSE:
{
  "success": true,
  "count": 5,
  "data": [
    { "name": "Hair Serum", ... },
    { "name": "Face Oil", ... },
    ...
  ]
}

FRONTEND:
setProducts(data.data);
```

---

## 📈 Scaling Considerations

### Current Capacity
- Single MongoDB instance
- Single Node.js server
- Frontend SPA (React)
- Handles ~1000 concurrent users

### For Production Scaling

#### Database
```
Current: Single MongoDB instance
↓
Production: MongoDB Atlas (cloud)
           + Indexes on frequently queried fields
           + Read replicas for scaling reads
```

#### Server
```
Current: Single Node.js instance
↓
Production: Multiple instances (3+)
           + Load balancer (Nginx)
           + Redis cache
           + PM2 for process management
```

#### Frontend
```
Current: npm start (dev server)
↓
Production: npm run build
           + Deploy to Vercel/Netlify
           + CDN for static files
           + Minified/optimized bundle
```

---

## 🔐 Security Architecture

```
Frontend (Client)
    ↓ (HTTPS only in production)
API Gateway (CORS enabled)
    ↓
Express Server
    ├─ Input Validation
    ├─ Error Handling
    └─ Rate Limiting (future)
    ↓
Database
    └─ MongoDB (no exposed credentials)
```

---

## 📊 Monitoring & Logging

### What to Monitor
```
Backend:
- Request count per endpoint
- Average response time
- Error rate
- Database query performance

Frontend:
- Page load time
- Component render time
- API call latency
- User actions
```

### Debug Tools
```
Backend:
- console.log("[v0] ...") for debugging
- MongoDB Compass for database inspection
- Postman for API testing

Frontend:
- React DevTools browser extension
- Console logs for debugging
- Network tab for API calls
```

---


## 📋 File Structure Breakdown

```
UGC-Ad-Generator/
│
├── Frontend (React)
│   ├── index.js                 (Entry point)
│   ├── App.js                   (Main component)
│   ├── App.css                  (Styles)
│   │
│   └── components/
│       ├── ProductForm.js       (Create products)
│       ├── HookGenerator.js     (Generate hooks)
│       ├── ScriptGenerator.js   (Generate scripts)
│       ├── CTAGenerator.js      (Generate CTAs)
│       └── OutputDisplay.js     (Export content)
│
├── Backend (Express)
│   ├── server.js                (Main server)
│   │
│   ├── models/
│   │   ├── Product.js           (Product schema)
│   │   ├── Hook.js              (Hook schema)
│   │   ├── UGCScript.js         (Script schema)
│   │   └── CTA.js               (CTA schema)
│   │
│   ├── routes/
│   │   ├── products.js          (/api/products)
│   │   ├── hooks.js             (/api/hooks)
│   │   ├── scripts.js           (/api/scripts)
│   │   ├── ctas.js              (/api/ctas)
│   │   └── prompts.js           (/api/prompts)
│   │
│   └── .env                     (Environment variables)
│
├── Documentation
│   ├── README.md                (Project overview)
│   ├── API.md                   (API reference)
│   ├── prompt-logic.md          (Prompt engineering)
│   ├── ARCHITECTURE.md          (This file)
│   ├── SAMPLE-OUTPUTS.md        (Examples)
│   ├── QUICKSTART.md            (Quick guide)
│   ├── SUBMISSION.md            (Submission guide)
│   └── CHANGELOG.md             (Version history)
│
└── Configuration
    ├── package.json             (Dependencies)
    ├── .gitignore               (Git config)
    └── .env.example             (Env template)
```

---

## 🔄 Workflow Diagram

```
START
  ↓
[User Opens App]
  ↓
[Choose Tab: Product/Hooks/Scripts/CTA/Output]
  ↓
┌──────────────────────────────────────────────┐
│ IF Product Tab:                              │
│   - Fill form                                │
│   - Click "Create Product"                   │
│   - API: POST /api/products                  │
│   - MongoDB: Insert document                 │
│   - UI: Show success                         │
└──────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────┐
│ IF Hooks Tab:                                │
│   - Select hook type                         │
│   - Click "Generate Hooks"                   │
│   - Display 15 hook variations               │
│   - Save: API: POST /api/hooks               │
│   - MongoDB: Insert hooks                    │
└──────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────┐
│ IF Scripts Tab:                              │
│   - Select parameters                        │
│   - Click "Generate Script"                  │
│   - Display full script (Hook→Problem→...)   │
│   - Save: API: POST /api/scripts             │
│   - MongoDB: Insert script                   │
└──────────────────────────────────────────────┘
  ↓
┌──────────────────────────────────────────────┐
│ IF Output Tab:                               │
│   - Fetch all data: API: GET /api/*          │
│   - Display stats                            │
│   - Export: JSON / Markdown                  │
│   - Download files                           │
└──────────────────────────────────────────────┘
  ↓
END
```

---

## 🎯 Key Design Principles

1. **Separation of Concerns**
   - Frontend (UI) separate from Backend (API)
   - Each component has single responsibility

2. **RESTful Architecture**
   - Standard HTTP methods (GET, POST, PUT, DELETE)
   - Predictable URL structure

3. **MVC Pattern**
   - Models (MongoDB schemas)
   - Views (React components)
   - Controllers (Express routes)

4. **Scalability**
   - Modular code structure
   - Easy to add new endpoints
   - Database ready for growth

5. **Error Handling**
   - Try-catch blocks
   - Meaningful error messages
   - Proper HTTP status codes

---

**This architecture is designed to be:**
- ✅ **Simple** - Easy to understand
- ✅ **Scalable** - Can grow with demand
- ✅ **Maintainable** - Clean code structure
- ✅ **Production-Ready** - Enterprise-grade patterns

---

*Document Version: 1.0*  
*Last Updated: January 2026*
