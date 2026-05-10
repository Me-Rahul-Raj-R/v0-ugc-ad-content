# UGC Ad Generator API Documentation

> **REST API for UGC Ad Content Generation System**

---

## Base URL
```
http://localhost:5000/api
```

---

## Authentication
Currently no authentication required. In production, add JWT tokens.

---

## Products Endpoint

### Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Hair Growth Serum",
  "description": "Natural serum for hair growth",
  "category": "d2c",
  "price": "₹699",
  "targetAudience": {
    "ageRange": "22-35",
    "gender": "Women",
    "region": "India",
    "painPoints": ["Hair fall", "Stress-related loss"]
  },
  "usp": [
    "Natural ingredients",
    "Results in 30 days",
    "Dermatologist tested"
  ],
  "platform": ["instagram", "facebook"],
  "brand": {
    "tone": "honest, friendly"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Hair Growth Serum",
    "category": "d2c",
    "createdAt": "2026-01-28T10:00:00Z"
  }
}
```

---

### Get All Products
```http
GET /products
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Hair Growth Serum",
      "description": "Natural serum for hair growth",
      "category": "d2c",
      "price": "₹699"
    }
  ]
}
```

---

### Get Single Product
```http
GET /products/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Hair Growth Serum",
    "description": "Natural serum for hair growth",
    "category": "d2c",
    "targetAudience": {
      "ageRange": "22-35",
      "gender": "Women",
      "region": "India",
      "painPoints": ["Hair fall", "Stress-related loss"]
    }
  }
}
```

---

### Update Product
```http
PUT /products/:id
Content-Type: application/json

{
  "price": "₹799"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { ... }
}
```

---

### Delete Product
```http
DELETE /products/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## Hooks Endpoint

### Create Hook
```http
POST /hooks
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "hookType": "frustration",
  "content": "My hair fall was getting scary",
  "wordCount": 5,
  "platform": "instagram",
  "tone": "casual, authentic"
}
```

**Hook Types:**
- `frustration` - "I was tired of..."
- `confession` - "I didn't expect..."
- `curiosity` - "No one talks about..."
- `pattern-break` - "This is not an ad"
- `transformation` - "After 30 days..."

**Response:**
```json
{
  "success": true,
  "message": "Hook created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "productId": "507f1f77bcf86cd799439011",
    "hookType": "frustration",
    "content": "My hair fall was getting scary",
    "wordCount": 5
  }
}
```

---

### Get Hooks by Product
```http
GET /hooks/product/:productId
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "hookType": "frustration",
      "content": "My hair fall was getting scary",
      "wordCount": 5
    }
  ]
}
```

---

### Get Hooks by Type
```http
GET /hooks/type/:hookType
```

**Example:** `/hooks/type/frustration`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "content": "My hair fall was getting scary",
      "hookType": "frustration"
    }
  ]
}
```

---

## Scripts Endpoint

### Create Script
```http
POST /scripts
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "hookId": "507f1f77bcf86cd799439012",
  "scriptType": "30-sec",
  "title": "Frustration - Instagram",
  "script": {
    "hook": "My hair fall was getting scary",
    "problem": "I was tired of losing hair every day",
    "discovery": "Then I tried this serum for 2-3 weeks",
    "result": "My hair started feeling stronger",
    "cta": "If hair fall bothers you, check it out"
  },
  "platform": "instagram",
  "tone": "authentic, casual",
  "language": "casual-english"
}
```

**Script Types:**
- `15-sec` - Short form
- `30-sec` - Optimal for most platforms
- `45-sec` - Extended
- `long-form` - Full explanation

**Response:**
```json
{
  "success": true,
  "message": "UGC script created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "productId": "507f1f77bcf86cd799439011",
    "scriptType": "30-sec",
    "status": "draft"
  }
}
```

---

### Get Scripts by Product
```http
GET /scripts/product/:productId
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Frustration - Instagram",
      "scriptType": "30-sec",
      "platform": "instagram",
      "status": "draft"
    }
  ]
}
```

---

### Update Script Status
```http
PUT /scripts/:id
Content-Type: application/json

{
  "status": "approved"
}
```

**Status Values:**
- `draft` - Work in progress
- `approved` - Ready for use
- `published` - Live

**Response:**
```json
{
  "success": true,
  "message": "Script updated successfully",
  "data": { ... }
}
```

---

## CTAs Endpoint

### Create CTA
```http
POST /ctas
Content-Type: application/json

{
  "productId": "507f1f77bcf86cd799439011",
  "ctaType": "soft",
  "content": "Just sharing what helped me",
  "platform": "instagram",
  "tone": "friendly, optional"
}
```

**CTA Types:**
- `soft` - Optional, friend-like ("You can try if you want")
- `medium` - Suggestive ("Worth trying if you struggle")
- `direct` - Sales-focused ("Get yours today")

**Response:**
```json
{
  "success": true,
  "message": "CTA created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "ctaType": "soft",
    "content": "Just sharing what helped me"
  }
}
```

---

### Get CTAs by Product
```http
GET /ctas/product/:productId
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "ctaType": "soft",
      "content": "Just sharing what helped me",
      "conversionRate": 0.08
    }
  ]
}
```

---

## Prompts Endpoint

### Get All Prompts
```http
GET /prompts
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": {
    "productAnalysis": {
      "name": "Product Intelligence Prompt",
      "description": "Analyze product and generate insights",
      "template": "You are a senior D2C performance marketer..."
    },
    "hookGenerator": {
      "name": "UGC Hook Generator",
      "description": "Generate scroll-stopping hooks",
      "template": "You are a viral UGC ad creator..."
    },
    "scriptGenerator": {
      "name": "Full UGC Script Generator",
      "description": "Generate authentic UGC ad scripts",
      "template": "You are a real customer filming..."
    },
    "ctaGenerator": {
      "name": "Soft CTA Generator",
      "description": "Generate non-pushy CTAs",
      "template": "Generate 10 soft UGC-style CTAs..."
    },
    "platformAdaptation": {
      "name": "Platform Adaptation",
      "description": "Adapt scripts for different platforms",
      "template": "Repurpose the following UGC ad script..."
    }
  }
}
```

---

### Get Specific Prompt
```http
GET /prompts/:promptId
```

**Example:** `/prompts/hookGenerator`

**Response:**
```json
{
  "success": true,
  "data": {
    "name": "UGC Hook Generator",
    "template": "You are a viral UGC ad creator for {{platform}}..."
  }
}
```

---

## Health Check

### API Status
```http
GET /api/health
```

**Response:**
```json
{
  "status": "UGC Ad Generator Backend Running"
}
```

---

## Error Handling

### Common Errors

**400 Bad Request**
```json
{
  "success": false,
  "error": "Validation failed: name is required"
}
```

**404 Not Found**
```json
{
  "success": false,
  "error": "Product not found"
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting. Recommended for production:
- 100 requests per minute per IP
- 10,000 requests per day per user

---

## Data Models

### Product Model
```javascript
{
  name: String,
  description: String,
  category: String, // d2c, local-business, saas, creator-brand
  price: String,
  targetAudience: {
    ageRange: String,
    gender: String,
    region: String,
    painPoints: [String]
  },
  usp: [String],
  platform: [String], // instagram, facebook, youtube, tiktok
  brand: {
    tone: String
  },
  createdAt: Date
}
```

### Hook Model
```javascript
{
  productId: ObjectId,
  hookType: String, // frustration, confession, curiosity, pattern-break, transformation
  content: String,
  wordCount: Number,
  platform: String,
  tone: String,
  performance: {
    clicks: Number,
    conversions: Number,
    ctr: Number
  },
  createdAt: Date
}
```

### Script Model
```javascript
{
  productId: ObjectId,
  hookId: ObjectId,
  scriptType: String, // 15-sec, 30-sec, 45-sec, long-form
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
  status: String, // draft, approved, published
  createdAt: Date,
  updatedAt: Date
}
```

### CTA Model
```javascript
{
  productId: ObjectId,
  ctaType: String, // soft, medium, direct
  content: String,
  platform: String,
  tone: String,
  conversionRate: Number,
  createdAt: Date
}
```

---

## Environment Variables

Create `.env` file in backend folder:
```
MONGODB_URI=mongodb://localhost:27017/ugc-ads
PORT=5000
NODE_ENV=development
```

---

## Testing API with cURL

### Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hair Growth Serum",
    "description": "Natural serum",
    "category": "d2c",
    "price": "₹699"
  }'
```

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Create Hook
```bash
curl -X POST http://localhost:5000/api/hooks \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "YOUR_PRODUCT_ID",
    "hookType": "frustration",
    "content": "My hair fall was scary",
    "wordCount": 5,
    "platform": "instagram"
  }'
```

---

**Last Updated:** January 2026  
**API Version:** 1.0
