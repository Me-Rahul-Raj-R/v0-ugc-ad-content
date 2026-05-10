'use client';

import React, { useState, useEffect } from 'react';

function OutputDisplay({ product }) {
  const [hooks, setHooks] = useState([]);
  const [scripts, setScripts] = useState([]);
  const [ctas, setCtas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      fetchAllContent();
    }
  }, [product]);

  const fetchAllContent = async () => {
    setLoading(true);
    try {
      // Fetch hooks
      const hooksRes = await fetch(`http://localhost:5000/api/hooks/product/${product._id}`);
      const hooksData = await hooksRes.json();
      setHooks(hooksData.data || []);

      // Fetch scripts
      const scriptsRes = await fetch(`http://localhost:5000/api/scripts/product/${product._id}`);
      const scriptsData = await scriptsRes.json();
      setScripts(scriptsData.data || []);

      // Fetch CTAs
      const ctasRes = await fetch(`http://localhost:5000/api/ctas/product/${product._id}`);
      const ctasData = await ctasRes.json();
      setCtas(ctasData.data || []);

      console.log('[v0] Content fetched:', { hooks: hooksData.data, scripts: scriptsData.data, ctas: ctasData.data });
    } catch (error) {
      console.log('[v0] Error fetching content:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const exportAsJSON = () => {
    const content = {
      product: product,
      hooks: hooks,
      scripts: scripts,
      ctas: ctas,
      generatedAt: new Date().toISOString()
    };

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(content, null, 2)));
    element.setAttribute('download', `ugc-content-pack-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const exportAsMarkdown = () => {
    let markdown = `# UGC Ad Content Pack\n\n`;
    markdown += `## Product: ${product.name}\n`;
    markdown += `${product.description}\n\n`;

    markdown += `### Hooks\n`;
    hooks.forEach((hook, idx) => {
      markdown += `${idx + 1}. "${hook.content}" (${hook.hookType})\n`;
    });

    markdown += `\n### Scripts\n`;
    scripts.forEach((script, idx) => {
      markdown += `\n#### Script ${idx + 1}\n`;
      markdown += `**Hook:** ${script.script.hook}\n`;
      markdown += `**Problem:** ${script.script.problem}\n`;
      markdown += `**Discovery:** ${script.script.discovery}\n`;
      markdown += `**Result:** ${script.script.result}\n`;
      markdown += `**CTA:** ${script.script.cta}\n`;
    });

    markdown += `\n### CTAs\n`;
    ctas.forEach((cta, idx) => {
      markdown += `${idx + 1}. "${cta.content}" (${cta.ctaType})\n`;
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(markdown));
    element.setAttribute('download', `ugc-content-pack-${Date.now()}.md`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!product) {
    return <div className="output-container"><p>Select a product first</p></div>;
  }

  return (
    <div className="output-container">
      <h2>📦 Complete UGC Content Pack</h2>
      <p>Product: <strong>{product.name}</strong></p>

      <div className="export-buttons">
        <button onClick={exportAsJSON} className="btn-primary">Export as JSON</button>
        <button onClick={exportAsMarkdown} className="btn-primary">Export as Markdown</button>
        <button onClick={fetchAllContent} className="btn-secondary">Refresh</button>
      </div>

      <div className="content-summary">
        <div className="summary-card">
          <h3>🎣 Hooks</h3>
          <p className="count">{hooks.length}</p>
        </div>
        <div className="summary-card">
          <h3>📝 Scripts</h3>
          <p className="count">{scripts.length}</p>
        </div>
        <div className="summary-card">
          <h3>📢 CTAs</h3>
          <p className="count">{ctas.length}</p>
        </div>
      </div>

      {loading ? (
        <p>Loading content...</p>
      ) : (
        <>
          {hooks.length > 0 && (
            <section className="content-section">
              <h3>Hooks ({hooks.length})</h3>
              <div className="hooks-grid">
                {hooks.map((hook, idx) => (
                  <div key={idx} className="content-item">
                    <p>"{hook.content}"</p>
                    <span className="badge">{hook.hookType}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {scripts.length > 0 && (
            <section className="content-section">
              <h3>Scripts ({scripts.length})</h3>
              {scripts.map((script, idx) => (
                <div key={idx} className="script-preview">
                  <h4>{script.title}</h4>
                  <div className="script-preview-content">
                    <p><strong>Hook:</strong> {script.script.hook}</p>
                    <p><strong>Problem:</strong> {script.script.problem}</p>
                    <p><strong>Discovery:</strong> {script.script.discovery}</p>
                    <p><strong>Result:</strong> {script.script.result}</p>
                    <p><strong>CTA:</strong> {script.script.cta}</p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {ctas.length > 0 && (
            <section className="content-section">
              <h3>CTAs ({ctas.length})</h3>
              <div className="ctas-grid">
                {ctas.map((cta, idx) => (
                  <div key={idx} className="content-item">
                    <p>"{cta.content}"</p>
                    <span className="badge">{cta.ctaType}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

export default OutputDisplay;
