'use client';

import React, { useState } from 'react';

function CTAGenerator({ product }) {
  const [ctas, setCtas] = useState([]);
  const [ctaType, setCtaType] = useState('soft');
  const [platform, setPlatform] = useState('instagram');
  const [loading, setLoading] = useState(false);
  const [manualCTA, setManualCTA] = useState('');

  // Sample CTAs
  const sampleCTAs = {
    soft: [
      'Just sharing what helped me',
      'You can try it if you want',
      'Worked for me, might help you',
      'If you struggle with this, check it out',
      'Linked if you\'re curious',
      'Not saying it\'s magic, but it worked',
      'You don\'t have to, but it helped me'
    ],
    medium: [
      'Give it a try if you\'re interested',
      'Worth checking out if you have the same issue',
      'I\'d recommend trying it',
      'If you want to see the difference, try it',
      'Seriously, if you deal with this, try it'
    ],
    direct: [
      'Get yours today',
      'Shop now',
      'Available on our website',
      'Link in bio',
      'Order now'
    ]
  };

  const generateCTAs = async () => {
    setLoading(true);
    try {
      const selectedCTAs = sampleCTAs[ctaType] || sampleCTAs.soft;
      setCtas(selectedCTAs);
      console.log('[v0] CTAs generated:', selectedCTAs);
    } catch (error) {
      console.log('[v0] Error generating CTAs:', error.message);
      alert('Error generating CTAs');
    } finally {
      setLoading(false);
    }
  };

  const addCTA = async () => {
    if (!manualCTA.trim()) {
      alert('Please enter a CTA');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/ctas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          ctaType,
          content: manualCTA,
          platform,
          tone: 'friendly, optional'
        })
      });

      const data = await response.json();
      if (data.success) {
        console.log('[v0] CTA saved:', data.data);
        setManualCTA('');
        alert('CTA saved successfully!');
        setCtas([...ctas, manualCTA]);
      }
    } catch (error) {
      console.log('[v0] Error saving CTA:', error.message);
      alert('Error saving CTA');
    }
  };

  return (
    <div className="generator-container">
      <h2>📢 CTA Generator</h2>
      <p>Generate soft, non-pushy calls-to-action</p>

      <div className="generator-controls">
        <div className="form-group">
          <label>CTA Type</label>
          <select value={ctaType} onChange={(e) => setCtaType(e.target.value)}>
            <option value="soft">Soft CTA (Optional)</option>
            <option value="medium">Medium CTA (Suggestions)</option>
            <option value="direct">Direct CTA (Buy Now)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Platform</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>

        <button onClick={generateCTAs} className="btn-primary" disabled={loading}>
          {loading ? 'Generating...' : 'Generate CTAs'}
        </button>
      </div>

      {ctas.length > 0 && (
        <div className="output-section">
          <h3>Generated CTAs ({ctas.length})</h3>
          <div className="cta-list">
            {ctas.map((cta, idx) => (
              <div key={idx} className="cta-card">
                <p>"{cta}"</p>
                <small className="cta-type">Type: {ctaType}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="manual-section">
        <h3>Or Add Custom CTA</h3>
        <textarea
          value={manualCTA}
          onChange={(e) => setManualCTA(e.target.value)}
          placeholder="Enter your own CTA here..."
          rows={3}
        />
        <button onClick={addCTA} className="btn-secondary">Save CTA</button>
      </div>

      <div className="info-box">
        <h4>💡 CTA Tips for UGC Ads</h4>
        <ul>
          <li>Soft CTAs convert better in UGC ads</li>
          <li>Avoid "Buy now" - use "Check it out"</li>
          <li>Make it feel optional</li>
          <li>Sound like a friend giving advice</li>
          <li>Test multiple CTAs to find best performer</li>
        </ul>
      </div>
    </div>
  );
}

export default CTAGenerator;
