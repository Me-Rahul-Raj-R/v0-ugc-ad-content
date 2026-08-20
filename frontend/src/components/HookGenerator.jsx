import React, { useState, useEffect, useCallback } from 'react';

function HookGenerator({ product, showToast }) {
  const [hookType, setHookType] = useState('frustration');
  const [platform, setPlatform] = useState('instagram');
  const [generatedHooks, setGeneratedHooks] = useState([]);
  const [savedHooks, setSavedHooks] = useState([]);
  const [customHook, setCustomHook] = useState('');
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState(null);

  const hookFrameworks = [
    { value: 'frustration', label: '😤 Frustration & Pain Trigger ("Every morning was a nightmare...")' },
    { value: 'confession', label: '🤫 Skeptic Confession ("I honestly thought this was a scam...")' },
    { value: 'pattern-break', label: '🛑 Pattern Interrupt ("Stop doing this immediately...")' },
    { value: 'curiosity', label: '👀 Curiosity Gap ("The 1 ingredient dermatologists won\'t tell you...")' },
    { value: 'transformation', label: '✨ Transformation Proof ("My 21-day results without filters...")' },
    { value: 'controversy', label: '⚡ Unpopular Truth ("Your expensive routine is actually ruining your results...")' }
  ];

  const fetchSavedHooks = useCallback(async () => {
    if (!product) return;
    try {
      const res = await fetch(`http://localhost:5000/api/hooks/product/${product._id || product.id}`);
      const data = await res.json();
      if (data.success) {
        setSavedHooks(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching hooks:', err);
    }
  }, [product]);

  useEffect(() => {
    fetchSavedHooks();
  }, [fetchSavedHooks]);

  const generateHooks = () => {
    if (!product) {
      showToast('Please select a product first!', true);
      return;
    }
    setLoading(true);

    const pName = product.name || 'this product';
    const pain1 = product.targetAudience?.painPoints?.[0] || 'hair fall and dullness';
    const usp1 = product.usp?.[0] || 'works in 21 days';

    const templates = {
      frustration: [
        `Every morning my pillow was literally full of hair`,
        `I was honestly so terrified of brushing my hair`,
        `Nothing worked for my ${pain1} until this`,
        `I spent thousands on clinic visits before trying ${pName}`,
        `If you are struggling with ${pain1}, watch this`
      ],
      confession: [
        `I honestly thought ${pName} was just another Instagram scam`,
        `Don't judge me, but I almost gave up completely`,
        `I did not want to film this until I saw results`,
        `I was ready to accept ${pain1} as permanent`,
        `My best friend made me try this, and I'm shocked`
      ],
      'pattern-break': [
        `Stop using heavy oils for ${pain1} immediately`,
        `This is NOT a paid brand sponsorship ad`,
        `Throw away your complicated 7-step routine`,
        `If your routine isn't giving results in 3 weeks, stop`,
        `You are applying your serum completely wrong`
      ],
      curiosity: [
        `The real reason nobody talks about stress-related ${pain1}`,
        `What happens when you use ${pName} for 21 days`,
        `I tested this viral routine so you don't have to`,
        `The one active ingredient that actually reversed my ${pain1}`,
        `Why your current routine isn't absorbing at all`
      ],
      transformation: [
        `This is my honest density after exactly 3 weeks`,
        `Look at this side-by-side: 30 days using ${pName}`,
        `My scalp has never felt this healthy before`,
        `Zero filters, zero salon treatments — just 3 drops daily`,
        `Here is proof that ${usp1}`
      ],
      controversy: [
        `Expensive salon treatments are a massive waste of money`,
        `Why 90% of popular hair oils do absolutely nothing`,
        `Stop buying viral products without checking the clinical actives`,
        `Why you don't need a 10-step routine to fix ${pain1}`,
        `The beauty industry doesn't want you knowing this`
      ]
    };

    setTimeout(() => {
      const selected = templates[hookType] || templates.frustration;
      setGeneratedHooks(selected);
      setLoading(false);
      showToast(`Generated 5 viral ${hookType} hooks!`);
    }, 250);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied hook to clipboard! 📋');
  };

  const saveHookToDB = async (content) => {
    if (!product) {
      showToast('Please select a product first', true);
      return;
    }

    try {
      setSavingId(content);
      const response = await fetch('http://localhost:5000/api/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id || product.id,
          hookType,
          content,
          platform,
          tone: 'authentic, casual'
        })
      });

      const data = await response.json();
      if (data.success) {
        showToast('Hook saved to MySQL database! 💾');
        fetchSavedHooks();
      } else {
        showToast(data.error || 'Failed to save hook', true);
      }
    } catch (err) {
      showToast('Error saving hook to MySQL', true);
    } finally {
      setSavingId(null);
    }
  };

  const deleteHookFromDB = async (hookId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/hooks/${hookId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        showToast('Hook removed from MySQL');
        fetchSavedHooks();
      }
    } catch (err) {
      showToast('Error deleting hook', true);
    }
  };

  const handleCustomHookSubmit = async (e) => {
    e.preventDefault();
    if (!customHook.trim()) return;
    await saveHookToDB(customHook.trim());
    setCustomHook('');
  };

  return (
    <div className="hook-studio">
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">
              <span>🎣</span> Viral UGC Hook Generator Studio
            </h2>
            <p className="panel-desc">
              Generate psychology-backed, scroll-stopping first 3 seconds for TikTok, Reels & Shorts.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Psychological Hook Angle</label>
            <select value={hookType} onChange={(e) => setHookType(e.target.value)}>
              {hookFrameworks.map((fw) => (
                <option key={fw.value} value={fw.value}>
                  {fw.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Target Social Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="instagram">Instagram Reels (Visual & Relatable)</option>
              <option value="tiktok">TikTok (Fast Paced & Unfiltered)</option>
              <option value="youtube">YouTube Shorts (Value & Transformation)</option>
              <option value="facebook">Facebook Feed (Story & Proof)</option>
            </select>
          </div>
        </div>

        <button onClick={generateHooks} className="btn-primary" disabled={loading}>
          {loading ? 'Generating Hooks...' : '✨ Generate 5 Scroll-Stopping Hooks'}
        </button>
      </div>

      {/* Generated Hooks */}
      {generatedHooks.length > 0 && (
        <div className="glass-panel">
          <h3 className="panel-title" style={{ marginBottom: '16px' }}>
            <span>⚡</span> Generated Hooks for {product ? product.name : 'Brand'}
          </h3>
          <div className="cards-grid">
            {generatedHooks.map((hook, idx) => {
              const words = hook.split(' ').length;
              return (
                <div key={idx} className="hook-card">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="badge badge-purple">{hookType}</span>
                      <span className="badge badge-amber">{words} words</span>
                    </div>
                    <p className="hook-quote">"{hook}"</p>
                  </div>
                  <div className="hook-meta">
                    <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                      {words <= 10 ? '✓ Ideal hook length (<10 words)' : '⚠ Slightly long'}
                    </span>
                    <div className="hook-actions">
                      <button className="btn-outline" onClick={() => copyToClipboard(hook)}>
                        Copy
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() => saveHookToDB(hook)}
                        disabled={savingId === hook}
                      >
                        {savingId === hook ? 'Saving...' : 'Save to MySQL'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Hook Builder */}
      <div className="glass-panel">
        <h3 className="panel-title" style={{ marginBottom: '8px' }}>
          <span>✍️</span> Custom Hook Builder
        </h3>
        <p className="panel-desc" style={{ marginBottom: '16px' }}>
          Craft your own custom hook and save directly to MySQL database for this campaign.
        </p>

        <form onSubmit={handleCustomHookSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={customHook}
              onChange={(e) => setCustomHook(e.target.value)}
              placeholder="e.g. Stop scrolling if you deal with morning hair fall..."
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Word count: {customHook ? customHook.trim().split(/\s+/).length : 0} words
            </span>
            <button type="submit" className="btn-primary" disabled={!customHook.trim()}>
              💾 Save Custom Hook to MySQL
            </button>
          </div>
        </form>
      </div>

      {/* Saved Hooks in MySQL */}
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <span>💾</span> Saved Hooks in MySQL ({savedHooks.length})
            </h3>
            <p className="panel-desc">All persisted hooks in table `hooks` for {product?.name || 'this product'}.</p>
          </div>
        </div>

        {savedHooks.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No saved hooks in MySQL yet. Generate or add some above!</p>
        ) : (
          <div className="cards-grid">
            {savedHooks.map((h) => (
              <div key={h._id || h.id} className="hook-card">
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="badge badge-emerald">{h.hookType}</span>
                    <span className="badge badge-blue">{h.platform}</span>
                  </div>
                  <p className="hook-quote">"{h.content}"</p>
                </div>
                <div className="hook-meta">
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    {h.wordCount} words • Saved in MySQL
                  </span>
                  <div className="hook-actions">
                    <button className="btn-outline" onClick={() => copyToClipboard(h.content)}>
                      Copy
                    </button>
                    <button
                      className="btn-danger"
                      onClick={() => deleteHookFromDB(h._id || h.id)}
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

export default HookGenerator;
