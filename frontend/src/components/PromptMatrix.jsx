import React, { useState, useEffect } from 'react';

function PromptMatrix({ product, showToast }) {
  const [prompts, setPrompts] = useState({});
  const [selectedKey, setSelectedKey] = useState('viralHookMatrix');
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/prompts');
      const data = await res.json();
      if (data.success) {
        setPrompts(data.data || {});
      }
    } catch (err) {
      console.error('Error fetching prompts:', err);
    }
  };

  const getPopulatedPrompt = (template) => {
    if (!template) return '';
    const pName = product?.name || '[Product Name]';
    const cat = product?.category || 'D2C Product';
    const audience = `${product?.targetAudience?.gender || 'Men & Women'}, ${product?.targetAudience?.ageRange || '20-35'} in ${product?.targetAudience?.region || 'India'}`;
    const price = product?.price || '₹699';
    const painPoints = product?.targetAudience?.painPoints?.join(', ') || 'Excessive hair fall, greasy scalp';
    const usp = product?.usp?.join(', ') || 'Visible density in 21 days with Redensyl';
    const brandTone = product?.brand?.tone || 'honest, authentic, conversational';

    return template
      .replace(/\{\{productName\}\}/g, pName)
      .replace(/\{\{category\}\}/g, cat)
      .replace(/\{\{targetAudience\}\}/g, audience)
      .replace(/\{\{price\}\}/g, price)
      .replace(/\{\{painPoints\}\}/g, painPoints)
      .replace(/\{\{painPoint\}\}/g, painPoints)
      .replace(/\{\{usp\}\}/g, usp)
      .replace(/\{\{brandTone\}\}/g, brandTone)
      .replace(/\{\{platform\}\}/g, 'Instagram Reels & TikTok')
      .replace(/\{\{language\}\}/g, 'casual conversational English');
  };

  const handleCopyPrompt = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('AI Prompt copied to clipboard! Paste into ChatGPT or Claude 🤖');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="prompt-matrix-studio">
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">
              <span>🤖</span> AI Prompt Matrix (ChatGPT / Claude / Gemini)
            </h2>
            <p className="panel-desc">
              Battle-tested master prompts automatically populated with your active product:{' '}
              <strong style={{ color: '#c4b5fd' }}>{product?.name || 'Selected Product'}</strong>.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {Object.keys(prompts).map((key) => {
            const p = prompts[key];
            const isActive = selectedKey === key;
            return (
              <button
                key={key}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedKey(key)}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {prompts[selectedKey] && (
          <div className="prompt-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: '17px', fontWeight: '800' }}>
                  {prompts[selectedKey].name}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {prompts[selectedKey].description}
                </p>
              </div>
              <button
                className="btn-primary"
                onClick={() =>
                  handleCopyPrompt(
                    selectedKey,
                    getPopulatedPrompt(prompts[selectedKey].template)
                  )
                }
              >
                {copiedKey === selectedKey ? '✓ Copied!' : '📋 Copy Prompt for AI'}
              </button>
            </div>

            <div className="prompt-code">
              {getPopulatedPrompt(prompts[selectedKey].template)}
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="badge badge-purple">ChatGPT-4o</span>
              <span className="badge badge-emerald">Claude 3.5 Sonnet</span>
              <span className="badge badge-blue">Google Gemini</span>
              <span style={{ fontSize: '12px', color: 'var(--text-dim)', marginLeft: 'auto' }}>
                Variables dynamically injected from MySQL active product
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PromptMatrix;
