import React, { useState, useEffect, useCallback } from 'react';

function CTAGenerator({ product, showToast }) {
  const [ctaCategory, setCtaCategory] = useState('soft');
  const [platform, setPlatform] = useState('instagram');
  const [generatedCTAs, setGeneratedCTAs] = useState([]);
  const [savedCTAs, setSavedCTAs] = useState([]);
  const [customCTA, setCustomCTA] = useState('');
  const [loading, setLoading] = useState(false);

  const ctaTypes = [
    { value: 'soft', label: '🌱 Soft & Optional ("Just sharing what worked for me...")' },
    { value: 'curiosity', label: '👀 Curiosity / Bio Link ("I linked the exact serum in my bio...")' },
    { value: 'offer', label: '🎁 Special Offer / Discount ("They have a first-order discount right now...")' },
    { value: 'direct', label: '🎯 Direct Action ("Tap below to check current stock...")' }
  ];

  const fetchSavedCTAs = useCallback(async () => {
    if (!product) return;
    try {
      const res = await fetch(`http://localhost:5000/api/ctas/product/${product._id || product.id}`);
      const data = await res.json();
      if (data.success) {
        setSavedCTAs(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching CTAs:', err);
    }
  }, [product]);

  useEffect(() => {
    fetchSavedCTAs();
  }, [fetchSavedCTAs]);

  const generateCTAs = () => {
    if (!product) {
      showToast('Please select a product first!', true);
      return;
    }
    setLoading(true);

    const pName = product.name || 'this product';
    const pain1 = product.targetAudience?.painPoints?.[0] || 'hair fall';

    const ctaTemplates = {
      soft: [
        `If ${pain1} has been stressing you out, you can check it out below.`,
        `Just sharing what genuinely helped me — link is down below!`,
        `You don't have to take my word for it, but it completely changed my routine.`,
        `Not saying it's magic, but if you struggle with this, it's worth checking out.`,
        `I left the link below in case anyone wants to read the reviews.`
      ],
      curiosity: [
        `I linked the exact ${pName} in my bio if you want to see the ingredients.`,
        `Check the link in comments to see their clinical trial results.`,
        `I put the link below — tap it to see what other people with ${pain1} are saying.`,
        `If you want to see the before and after gallery, tap the link below.`,
        `Everything is linked in bio if you're curious!`
      ],
      offer: [
        `They currently have a starter discount running if you use the link below.`,
        `Tap below to see if the first-time buyer bundle is still available.`,
        `I grabbed mine on sale — check the link below to get 15% off.`,
        `They're doing free shipping this week through the link below!`,
        `Check the discount link down below before stock runs out.`
      ],
      direct: [
        `Tap the link below to order yours directly from their verified site.`,
        `Click through to take their 30-second scalp quiz and get your routine.`,
        `Grab a bottle today and start your 21-day transformation.`,
        `Shop now via the link below with full money-back guarantee.`,
        `Tap the link right now to secure your starter kit.`
      ]
    };

    setTimeout(() => {
      const selected = ctaTemplates[ctaCategory] || ctaTemplates.soft;
      setGeneratedCTAs(selected);
      setLoading(false);
      showToast(`Generated 5 ${ctaCategory} CTAs! 📢`);
    }, 250);
  };

  const copyCTA = (text) => {
    navigator.clipboard.writeText(text);
    showToast('CTA copied to clipboard! 📋');
  };

  const saveCTAToDB = async (content) => {
    if (!product) {
      showToast('Please select a product first', true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/ctas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id || product.id,
          ctaType: ctaCategory,
          content,
          platform,
          tone: 'friendly, trust-based'
        })
      });

      const data = await response.json();
      if (data.success) {
        showToast('CTA saved to MySQL database! 💾');
        fetchSavedCTAs();
      } else {
        showToast(data.error || 'Failed to save CTA', true);
      }
    } catch (err) {
      showToast('Error saving CTA to MySQL', true);
    }
  };

  const deleteCTAFromDB = async (ctaId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/ctas/${ctaId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        showToast('CTA deleted from MySQL');
        fetchSavedCTAs();
      }
    } catch (err) {
      showToast('Error deleting CTA', true);
    }
  };

  const handleCustomCTASubmit = async (e) => {
    e.preventDefault();
    if (!customCTA.trim()) return;
    await saveCTAToDB(customCTA.trim());
    setCustomCTA('');
  };

  return (
    <div className="cta-studio">
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">
              <span>📢</span> High-Converting CTA Vault
            </h2>
            <p className="panel-desc">
              UGC ads convert best with non-aggressive, trust-first peer recommendations.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>CTA Psychological Category</label>
            <select value={ctaCategory} onChange={(e) => setCtaCategory(e.target.value)}>
              {ctaTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Platform Placement</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="instagram">Instagram (Reels / Link in Bio)</option>
              <option value="tiktok">TikTok (Comment Pinned Link / Showcase)</option>
              <option value="youtube">YouTube Shorts (Description & Pinned Link)</option>
              <option value="facebook">Facebook Ads (Learn More / Shop Button)</option>
            </select>
          </div>
        </div>

        <button onClick={generateCTAs} className="btn-primary" disabled={loading}>
          {loading ? 'Generating CTAs...' : '🎯 Generate 5 Conversion CTAs'}
        </button>
      </div>

      {/* Generated CTAs */}
      {generatedCTAs.length > 0 && (
        <div className="glass-panel">
          <h3 className="panel-title" style={{ marginBottom: '16px' }}>
            <span>⚡</span> Generated CTAs for {product?.name || 'Brand'}
          </h3>
          <div className="cards-grid">
            {generatedCTAs.map((cta, idx) => (
              <div key={idx} className="hook-card">
                <div>
                  <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>
                    {ctaCategory}
                  </span>
                  <p className="hook-quote">"{cta}"</p>
                </div>
                <div className="hook-meta">
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    High-converting UGC ending
                  </span>
                  <div className="hook-actions">
                    <button className="btn-outline" onClick={() => copyCTA(cta)}>
                      Copy
                    </button>
                    <button className="btn-secondary" onClick={() => saveCTAToDB(cta)}>
                      Save to MySQL
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom CTA */}
      <div className="glass-panel">
        <h3 className="panel-title" style={{ marginBottom: '8px' }}>
          <span>✍️</span> Custom CTA Builder
        </h3>
        <p className="panel-desc" style={{ marginBottom: '16px' }}>
          Add your custom call-to-action to MySQL database.
        </p>

        <form onSubmit={handleCustomCTASubmit}>
          <div className="form-group">
            <input
              type="text"
              value={customCTA}
              onChange={(e) => setCustomCTA(e.target.value)}
              placeholder="e.g. Try it for 3 weeks risk-free with code UGC15..."
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <button type="submit" className="btn-primary" disabled={!customCTA.trim()}>
              💾 Save Custom CTA to MySQL
            </button>
          </div>
        </form>
      </div>

      {/* Saved CTAs in MySQL */}
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <span>💾</span> Saved CTAs in MySQL ({savedCTAs.length})
            </h3>
            <p className="panel-desc">CTAs stored in table `ctas` for {product?.name || 'this product'}.</p>
          </div>
        </div>

        {savedCTAs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No saved CTAs in MySQL database yet.</p>
        ) : (
          <div className="cards-grid">
            {savedCTAs.map((c) => (
              <div key={c._id || c.id} className="hook-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="badge badge-purple">{c.ctaType}</span>
                    <span className="badge badge-blue">{c.platform}</span>
                  </div>
                  <p className="hook-quote">"{c.content}"</p>
                </div>
                <div className="hook-meta">
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Saved in MySQL</span>
                  <div className="hook-actions">
                    <button className="btn-outline" onClick={() => copyCTA(c.content)}>
                      Copy
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => deleteCTAFromDB(c._id || c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CTAGenerator;
