// Prompts Route - Returns prompt templates
const express = require('express');
const router = express.Router();

// Get all prompt templates
router.get('/', (req, res) => {
  const prompts = {
    productAnalysis: {
      name: 'Product Intelligence Prompt',
      description: 'Analyze product and generate insights',
      template: `You are a senior D2C performance marketer.
Analyze the following product and generate:
1. Target audience personas
2. Core pain points
3. Emotional triggers
4. Objections buyers may have
5. Unique selling points (USPs)
6. Conversion angles

Product details:
- Name: {{productName}}
- Category: {{category}}
- Target audience: {{targetAudience}}
- Price: {{price}}
- Key benefit: {{keyBenefit}}
- Brand tone: {{brandTone}}

Output in clean bullet points.`
    },
    hookGenerator: {
      name: 'UGC Hook Generator',
      description: 'Generate scroll-stopping hooks',
      template: `You are a viral UGC ad creator for {{platform}}.
Generate 15 scroll-stopping hooks for a UGC-style ad.

Rules:
- Max 10 words per hook
- Sound like a real person, not a brand
- Focus on pain, curiosity, or transformation
- Avoid marketing buzzwords
- Use casual language

Product: {{productName}}
Category: {{category}}
Audience: {{targetAudience}}
Pain point: {{painPoint}}

Format: Just list the hooks, one per line.`
    },
    scriptGenerator: {
      name: 'Full UGC Script Generator',
      description: 'Generate authentic UGC ad scripts',
      template: `You are a real customer filming a selfie-style video at home.
Write a 30-second UGC ad script using this structure:

1. Hook (first 2 seconds)
2. Personal problem
3. Discovery moment
4. Results/benefits
5. Soft CTA

Guidelines:
- Casual {{language}}
- Conversational tone
- No brand hype
- No emojis
- First-person language
- Imperfect, natural delivery

Product: {{productName}}
Hook type: {{hookType}}
Platform: {{platform}}

Format as:
[HOOK]
[PROBLEM]
[DISCOVERY]
[RESULT]
[CTA]`
    },
    ctaGenerator: {
      name: 'Soft CTA Generator',
      description: 'Generate non-pushy CTAs',
      template: `Generate 10 soft UGC-style CTAs for a {{platform}} ad.

Rules:
- No "Buy now" or aggressive language
- Friendly and optional tone
- Feels like advice from a friend
- Trust-based approach

Product: {{productName}}
Audience: {{targetAudience}}
Tone: {{tone}}

Format: Just list CTAs, one per line.`
    },
    platformAdaptation: {
      name: 'Platform Adaptation',
      description: 'Adapt scripts for different platforms',
      template: `Repurpose the following UGC ad script for:
1. Instagram Reels
2. Facebook Feed
3. YouTube Shorts

Rules:
- Adjust hook style per platform
- Maintain same core message
- Keep UGC authenticity
- Use platform-specific language

Original script:
{{script}}

For each platform, provide the adapted version.`
    }
  };

  res.json({
    success: true,
    count: Object.keys(prompts).length,
    data: prompts
  });
});

// Get specific prompt by ID
router.get('/:promptId', (req, res) => {
  const prompts = {
    productAnalysis: {
      name: 'Product Intelligence Prompt',
      template: 'Product analysis prompt template...'
    },
    hookGenerator: {
      name: 'UGC Hook Generator',
      template: 'Hook generation prompt template...'
    },
    scriptGenerator: {
      name: 'Full UGC Script Generator',
      template: 'Script generation prompt template...'
    },
    ctaGenerator: {
      name: 'Soft CTA Generator',
      template: 'CTA generation prompt template...'
    },
    platformAdaptation: {
      name: 'Platform Adaptation',
      template: 'Platform adaptation prompt template...'
    }
  };

  const prompt = prompts[req.params.promptId];

  if (!prompt) {
    return res.status(404).json({
      success: false,
      error: 'Prompt not found'
    });
  }

  res.json({
    success: true,
    data: prompt
  });
});

module.exports = router;
