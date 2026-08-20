import React, { useState, useEffect, useCallback } from 'react';

function OutputDisplay({ product, showToast }) {
  const [hooks, setHooks] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [ctas, setCtas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchAllContent = useCallback(async () => {
    if (!product) return;
    setLoading(true);
    try {
      const prodId = product._id || product.id;
      const [hooksRes, scriptsRes, ctasRes] = await Promise.all([
        fetch(`http://localhost:5000/api/hooks/product/${prodId}`),
        fetch(`http://localhost:5000/api/scripts/product/${prodId}`),
        fetch(`http://localhost:5000/api/ctas/product/${prodId}`)
      ]);

      const [hooksData, scriptsData, ctasData] = await Promise.all([
        hooksRes.json(),
        scriptsRes.json(),
        ctasRes.json()
      ]);

      setHooks(hooksData.data || []);
      setScripts(scriptsData.data || []);
      setCtas(ctasData.data || []);
    } catch (error) {
      showToast('Error loading saved campaign from MySQL', true);
    } finally {
      setLoading(false);
    }
  }, [product, showToast]);

  useEffect(() => {
    fetchAllContent();
  }, [fetchAllContent]);

  const exportAsJSON = () => {
    const campaignData = {
      product,
      hooks,
      scripts,
      ctas,
      exportedAt: new Date().toISOString(),
      generatedBy: 'UGC Ad Content Generator'
    };

    const blob = new Blob([JSON.stringify(campaignData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UGC-Campaign-${(product?.name || 'pack').replace(/\s+/g, '-')}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported campaign as JSON! 📦');
  };

  const exportAsMarkdown = () => {
    let md = `# UGC CREATIVE CAMPAIGN BRIEF\n\n`;
    md += `## 📦 BRAND & PRODUCT OVERVIEW\n`;
    md += `- **Product Name:** ${product?.name}\n`;
    md += `- **Category:** ${product?.category}\n`;
    md += `- **Price / Offer:** ${product?.price}\n`;
    md += `- **Description:** ${product?.description}\n`;
    md += `- **Target Demographic:** ${product?.targetAudience?.gender}, ${product?.targetAudience?.ageRange} in ${product?.targetAudience?.region}\n`;
    md += `- **Core Pain Points:** ${product?.targetAudience?.painPoints?.join(', ')}\n`;
    md += `- **USPs & Claims:** ${product?.usp?.join(', ')}\n\n`;

    md += `---\n\n## 🎣 SAVED VIRAL HOOKS (${hooks.length})\n`;
    hooks.forEach((h, i) => {
      md += `${i + 1}. **"${h.content}"** \n   - Angle: \`${h.hookType}\` | Length: ${h.wordCount} words | Platform: \`${h.platform}\`\n\n`;
    });

    md += `---\n\n## 🎬 PRODUCTION-READY UGC SCRIPTS (${scripts.length})\n`;
    scripts.forEach((s, i) => {
      const sc = s.script || {};
      md += `### Script ${i + 1}: ${s.title} (${s.duration})\n`;
      md += `- **[0:00 - 0:03 HOOK]:** "${sc.hook}"\n`;
      md += `- **[0:03 - 0:10 PROBLEM]:** ${sc.problem}\n`;
      md += `- **[0:10 - 0:18 DISCOVERY]:** ${sc.discovery}\n`;
      md += `- **[0:18 - 0:25 RESULT & PROOF]:** ${sc.result}\n`;
      md += `- **[0:25 - 0:30 CTA]:** "${sc.cta}"\n`;
      if (sc.visualCues) {
        md += `\n**Visual Scene Instructions:**\n\`\`\`\n${sc.visualCues}\n\`\`\`\n`;
      }
      md += `\n`;
    });

    md += `---\n\n## 📢 CALLS TO ACTION (${ctas.length})\n`;
    ctas.forEach((c, i) => {
      md += `${i + 1}. **"${c.content}"** (\`${c.ctaType}\` - ${c.platform})\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UGC-Campaign-Brief-${(product?.name || 'brief').replace(/\s+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported complete Markdown Brief! 📄');
  };

  const exportAsCSV = () => {
    let csv = `Type,Category,Content,Details,Platform\n`;
    hooks.forEach((h) => {
      csv += `"Hook","${h.hookType}","${h.content.replace(/"/g, '""')}","${h.wordCount} words","${h.platform}"\n`;
    });
    ctas.forEach((c) => {
      csv += `"CTA","${c.ctaType}","${c.content.replace(/"/g, '""')}","${c.tone}","${c.platform}"\n`;
    });
    scripts.forEach((s) => {
      const sc = s.script || {};
      csv += `"Script","${s.duration}","${(sc.hook || '').replace(/"/g, '""')}","${s.title}","${s.platform}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UGC-Assets-${(product?.name || 'assets').replace(/\s+/g, '-')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported assets as CSV spreadsheet! 📊');
  };

  const copyItem = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard! 📋');
  };

  if (!product) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px' }}>No Active Product Selected</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Please go to the <strong>Product Setup</strong> tab to select or create a brand.
        </p>
      </div>
    );
  }

  return (
    <div className="campaign-vault">
      {/* Overview & Export Bar */}
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">
              <span>📊</span> MySQL Campaign Vault & Creator Brief
            </h2>
            <p className="panel-desc">
              Campaign assets stored in MySQL Workbench database for:{' '}
              <strong style={{ color: '#c4b5fd' }}>{product.name}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={exportAsMarkdown}>
              📄 Export Brief (.MD)
            </button>
            <button className="btn-secondary" onClick={exportAsJSON}>
              📦 Export JSON
            </button>
            <button className="btn-secondary" onClick={exportAsCSV}>
              📊 Export CSV
            </button>
            <button className="btn-outline" onClick={fetchAllContent}>
              🔄 Refresh MySQL
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
          <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
              Saved Hooks
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#c4b5fd', marginTop: '4px' }}>
              {hooks.length}
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
              Full Scripts
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#6ee7b7', marginTop: '4px' }}>
              {scripts.length}
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
              Saved CTAs
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#93c5fd', marginTop: '4px' }}>
              {ctas.length}
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>
              Database Status
            </div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#34d399', marginTop: '12px' }}>
              ✓ Synced with MySQL
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Assets ({hooks.length + scripts.length + ctas.length})
            </button>
            <button
              className={`tab-btn ${activeFilter === 'hooks' ? 'active' : ''}`}
              onClick={() => setActiveFilter('hooks')}
            >
              Hooks ({hooks.length})
            </button>
            <button
              className={`tab-btn ${activeFilter === 'scripts' ? 'active' : ''}`}
              onClick={() => setActiveFilter('scripts')}
            >
              Scripts ({scripts.length})
            </button>
            <button
              className={`tab-btn ${activeFilter === 'ctas' ? 'active' : ''}`}
              onClick={() => setActiveFilter('ctas')}
            >
              CTAs ({ctas.length})
            </button>
          </div>

          <input
            type="text"
            placeholder="🔍 Search saved assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#fff',
              outline: 'none',
              fontSize: '13px',
              width: '240px'
            }}
          />
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading assets from MySQL...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Hooks Section */}
            {(activeFilter === 'all' || activeFilter === 'hooks') && hooks.length > 0 && (
              <div>
                <h3 style={{ color: '#c4b5fd', fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>
                  🎣 Hooks in MySQL
                </h3>
                <div className="cards-grid">
                  {hooks
                    .filter((h) => h.content.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((h) => (
                      <div key={h._id || h.id} className="hook-card">
                        <div>
                          <span className="badge badge-purple">{h.hookType}</span>
                          <p className="hook-quote" style={{ marginTop: '8px' }}>
                            "{h.content}"
                          </p>
                        </div>
                        <div className="hook-meta">
                          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                            {h.wordCount} words
                          </span>
                          <button className="btn-outline" onClick={() => copyItem(h.content)}>
                            Copy
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Scripts Section */}
            {(activeFilter === 'all' || activeFilter === 'scripts') && scripts.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#6ee7b7', fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>
                  📝 Full Scripts in MySQL
                </h3>
                {scripts.map((s) => {
                  const sc = s.script || {};
                  return (
                    <div key={s._id || s.id} className="script-card-full" style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <strong style={{ color: '#fff', fontSize: '15px' }}>{s.title}</strong>
                        <span className="badge badge-emerald">{s.duration}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
                        <strong>Hook:</strong> "{sc.hook}"
                      </p>
                      <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
                        <strong>Problem:</strong> {sc.problem}
                      </p>
                      <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
                        <strong>Result:</strong> {sc.result}
                      </p>
                      <p style={{ fontSize: '13px', color: '#cbd5e1' }}>
                        <strong>CTA:</strong> "{sc.cta}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* CTAs Section */}
            {(activeFilter === 'all' || activeFilter === 'ctas') && ctas.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#93c5fd', fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>
                  📢 Calls to Action in MySQL
                </h3>
                <div className="cards-grid">
                  {ctas
                    .filter((c) => c.content.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((c) => (
                      <div key={c._id || c.id} className="hook-card">
                        <div>
                          <span className="badge badge-blue">{c.ctaType}</span>
                          <p className="hook-quote" style={{ marginTop: '8px' }}>
                            "{c.content}"
                          </p>
                        </div>
                        <div className="hook-meta">
                          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                            {c.platform}
                          </span>
                          <button className="btn-outline" onClick={() => copyItem(c.content)}>
                            Copy
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputDisplay;
