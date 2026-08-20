// Prompts Route - Professional UGC AI Prompts for ChatGPT, Claude & Gemini
const express = require('express');
const router = express.Router();

const prompts = {
  productIntelligence: {
    id: 'productIntelligence',
    name: '🧠 Deep Product Intelligence & Angle Finder',
    category: 'Analysis',
    description: 'Deconstructs product features into emotional hooks, customer objections, and high-converting angles.',
    template: `You are a world-class D2C Performance Marketing Strategist and UGC Creative Director.
Analyze the following product and generate:
1. Target Customer Avatar (Age, daily lifestyle, emotional insecurity)
2. The Real Villain (The root frustration they are struggling with)
3. 5 High-Intent UGC Angles (e.g., "The Skeptic Converted", "Morning Routine Hack", "Dermatologist Alternative", "Before-After Proof", "Stop Wasting Money")
4. 3 Customer Objections & How to Counter Them in Video Scripts
5. 5 Visual B-Roll Ideas for High Retention

Product Information:
- Product Name: {{productName}}
- Category: {{category}}
- Target Audience: {{targetAudience}}
- Price: {{price}}
- Pain Points: {{painPoints}}
- USPs: {{usp}}
- Brand Tone: {{brandTone}}

Format the output in clear, structured markdown with punchy bullet points.`
  },
  viralHookMatrix: {
    id: 'viralHookMatrix',
    name: '🎣 15 Viral UGC Hook Variations',
    category: 'Hooks',
    description: 'Generates 15 scroll-stopping hooks tailored for TikTok, Instagram Reels, and YouTube Shorts.',
    template: `You are an elite UGC Ad Creator specializing in viral TikTok and Instagram Reels video ads.
Generate 15 scroll-stopping hooks for {{platform}} for the product "{{productName}}".

Generate 3 hooks for each of these 5 psychological frameworks:
1. FRUSTRATION HOOKS (Raw, relatable, negative emotion trigger)
2. CONFESSION / SKEPTIC HOOKS ("I didn't think this would work...", "Don't judge me but...")
3. PATTERN INTERRUPT ("Stop doing X immediately", "This is NOT a paid ad")
4. CURIOSITY GAP ("The secret reason why...", "Nobody is talking about this")
5. TRANSFORMATION ("My 30-day honest results with no filters")

Rules:
- Strictly under 10 words per hook.
- Sound like a real person talking to their best friend, NOT a brand.
- Zero marketing jargon, zero fake buzzwords.
- Optimized for {{platform}}.

Product: {{productName}}
Core Pain Point: {{painPoints}}
Target Demographic: {{targetAudience}}`
  },
  full30SecScript: {
    id: 'full30SecScript',
    name: '🎬 Complete 30-Second UGC Video Ad Script',
    category: 'Scripts',
    description: 'Generates a full selfie-style UGC video script with visual cues, dialogue, and soft CTA.',
    template: `You are a real customer filming an authentic selfie-style video on their iPhone in natural room lighting.
Write a high-converting 30-second UGC Video Ad Script for {{platform}} promoting "{{productName}}".

Structure:
- [0:00 - 0:03] HOOK: Visual & Spoken hook that stops the scroll
- [0:03 - 0:10] PROBLEM: Personal struggle with {{painPoints}} that feels 100% genuine
- [0:10 - 0:18] DISCOVERY: How they found "{{productName}}" and why it's different from competitors
- [0:18 - 0:25] RESULT: Concrete transformation & benefits (touching face/hair, showing real texture)
- [0:25 - 0:30] SOFT CTA: Non-pushy, trust-based call to action

Include exact [VISUAL CUES] and [AUDIO CUES] for the creator filming the ad.

Tone: {{brandTone}}
Language: Casual Conversational English`
  },
  softCTAVault: {
    id: 'softCTAVault',
    name: '📢 Trust-Based Soft CTA Generator',
    category: 'CTAs',
    description: 'Creates non-aggressive, high-converting calls to action that boost click-through rates.',
    template: `Generate 10 authentic, trust-based Call To Actions (CTAs) for a UGC ad promoting "{{productName}}".

Rules:
- Avoid aggressive "BUY NOW" or "LIMITED TIME" hype.
- Use friendly, helpful, peer-to-peer recommendations.
- Categorize into:
  * 4 Soft & Friendly CTAs ("If this sounds like you, check it out below")
  * 3 Curiosity CTAs ("I linked it in bio if you want to see the ingredients")
  * 3 Direct Value CTAs ("They have a first-order discount running right now")

Target Platform: {{platform}}`
  }
};

// Get all prompt templates
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: Object.keys(prompts).length,
    data: prompts
  });
});

// Get prompt by key
router.get('/:key', (req, res) => {
  const prompt = prompts[req.params.key];
  if (!prompt) {
    return res.status(404).json({
      success: false,
      error: 'Prompt template not found'
    });
  }
  res.json({
    success: true,
    data: prompt
  });
});

module.exports = router;
