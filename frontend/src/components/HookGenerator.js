'use client';

import React, { useState } from 'react';

function HookGenerator({ product }) {
  const [hooks, setHooks] = useState([]);
  const [hookType, setHookType] = useState('frustration');
  const [platform, setPlatform] = useState('instagram');
  const [loading, setLoading] = useState(false);
  const [manualHook, setManualHook] = useState('');

  const hookTypes = [
    { value: 'frustration', label: 'Frustration Hook - "I was tired of..."' },
    { value: 'confession', label: 'Confession Hook - "I didn\'t expect..."' },
    { value: 'curiosity', label: 'Curiosity Hook - "No one talks about..."' },
    { value: 'pattern-break', label: 'Pattern Break - "This is not an ad"' },
    { value: 'transformation', label: 'Transformation Hook - "After 30 days..."' }
  ];

  // Predefined hooks for demo purposes
  const predefinedHooks = {
    frustration: [
      'My hair fall was getting scary',
      'Every shower meant more hair loss',
      'I was running out of confidence',
      'Stress literally ruined my hair',
      'My pillow was full of hair every morning'
    ],
    confession: [
      'I didn\'t expect this to work',
      'I was ready to give up honestly',
      'I\'m not even promoting this',
      'This shocked me actually',
      'I wasn\'t planning to share this'
    ],
    curiosity: [
      'No one talks about stress hair fall',
      'This changed my hair routine completely',
      'I noticed this after 3 weeks',
      'Something clicked for me',
      'This is what actually works'
    ],
    'pattern-break': [
      'This is not an ad',
      'I stopped using oil completely',
      'I tried something completely different',
      'This was unexpected honestly',
      'Nobody told me this would work'
    ],
    transformation: [
      'This is my hair after one month',
      'My hair looks completely different now',
      'Less hair on my pillow now',
      'My hair feels so much stronger',
      'Hair is finally growing back'
    ]
  };

  const generateHooks = async () => {
    setLoading(true);
    try {
      // Simulate API call with predefined hooks
      const selectedHooks = predefinedHooks[hookType] || [];
      setHooks(selectedHooks);
      console.log('[v0] Hooks generated:', selectedHooks);
    } catch (error) {
      console.log('[v0] Error generating hooks:', error.message);
      alert('Error generating hooks');
    } finally {
      setLoading(false);
    }
  };

  const addHook = async () => {
    if (!manualHook.trim()) {
      alert('Please enter a hook');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          hookType,
          content: manualHook,
          wordCount: manualHook.split(' ').length,
          platform,
          tone: 'casual, authentic'
        })
      });

      const data = await response.json();
      if (data.success) {
        console.log('[v0] Hook saved:', data.data);
        setManualHook('');
        alert('Hook saved successfully!');
        setHooks([...hooks, manualHook]);
      }
    } catch (error) {
      console.log('[v0] Error saving hook:', error.message);
      alert('Error saving hook');
    }
  };

  return (
    <div className="generator-container">
      <h2>🎣 Hook Generator</h2>
      <p>Create scroll-stopping hooks for your UGC ads</p>

      <div className="generator-controls">
        <div className="form-group">
          <label>Hook Type</label>
          <select value={hookType} onChange={(e) => setHookType(e.target.value)}>
            {hookTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Platform</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="instagram">Instagram Reels</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube Shorts</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>

        <button onClick={generateHooks} className="btn-primary" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Hooks'}
        </button>
      </div>

      {hooks.length > 0 && (
        <div className="output-section">
          <h3>Generated Hooks ({hooks.length})</h3>
          <div className="hooks-list">
            {hooks.map((hook, idx) => (
              <div key={idx} className="hook-card">
                <p>"{hook}"</p>
                <small>{hook.split(' ').length} words</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="manual-section">
        <h3>Or Add Custom Hook</h3>
        <textarea
          value={manualHook}
          onChange={(e) => setManualHook(e.target.value)}
          placeholder="Enter your own hook here..."
          rows={3}
        />
        <small>Max 10 words recommended</small>
        <button onClick={addHook} className="btn-secondary">Save Hook</button>
      </div>
    </div>
  );
}

export default HookGenerator;
