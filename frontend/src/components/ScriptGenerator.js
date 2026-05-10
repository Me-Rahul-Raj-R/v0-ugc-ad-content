'use client';

import React, { useState } from 'react';

function ScriptGenerator({ product }) {
  const [scripts, setScripts] = useState([]);
  const [scriptType, setScriptType] = useState('30-sec');
  const [hookType, setHookType] = useState('frustration');
  const [platform, setPlatform] = useState('instagram');
  const [loading, setLoading] = useState(false);

  // Sample scripts for demo
  const sampleScripts = {
    frustration: {
      hook: 'My hair fall was getting scary',
      problem: 'I was honestly tired of losing hair every day. The stress made it worse.',
      discovery: 'Then I started using this serum consistently for about 2-3 weeks.',
      result: 'And honestly? My hair started feeling stronger. Less hair on my pillow now.',
      cta: 'If hair fall bothers you too, you can check it out.'
    },
    confession: {
      hook: 'I didn\'t expect this to work',
      problem: 'I\'ve tried so many hair products that promised results but failed.',
      discovery: 'Someone suggested this serum and I thought, why not try one more time?',
      result: 'After about a month, my hair quality actually improved. It\'s thicker now.',
      cta: 'Just sharing what helped me. Might work for you too.'
    },
    curiosity: {
      hook: 'No one talks about stress hair loss',
      problem: 'Stress directly impacts hair health, but nobody really discusses this.',
      discovery: 'I found this serum that\'s specifically designed for stress-related hair fall.',
      result: 'The difference after 30 days was noticeable. My hair looks healthier.',
      cta: 'If you deal with stress hair fall, this might help.'
    }
  };

  const generateScript = async () => {
    setLoading(true);
    try {
      // Get sample script
      const sample = sampleScripts[hookType] || sampleScripts.frustration;
      
      const fullScript = {
        hook: sample.hook,
        problem: sample.problem,
        discovery: sample.discovery,
        result: sample.result,
        cta: sample.cta,
        duration: scriptType,
        platform: platform
      };

      setScripts([...scripts, fullScript]);
      console.log('[v0] Script generated:', fullScript);
    } catch (error) {
      console.log('[v0] Error generating script:', error.message);
      alert('Error generating script');
    } finally {
      setLoading(false);
    }
  };

  const saveScript = async (scriptData) => {
    try {
      const response = await fetch('http://localhost:5000/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          scriptType,
          title: `${hookType} - ${platform}`,
          script: scriptData,
          platform,
          tone: 'authentic, casual',
          language: 'casual-english'
        })
      });

      const data = await response.json();
      if (data.success) {
        console.log('[v0] Script saved:', data.data);
        alert('Script saved successfully!');
      }
    } catch (error) {
      console.log('[v0] Error saving script:', error.message);
      alert('Error saving script');
    }
  };

  const downloadScript = (script) => {
    const text = `HOOK:\n${script.hook}\n\nPROBLEM:\n${script.problem}\n\nDISCOVERY:\n${script.discovery}\n\nRESULT:\n${script.result}\n\nCTA:\n${script.cta}`;
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `ugc-script-${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="generator-container">
      <h2>📝 UGC Script Generator</h2>
      <p>Generate full 30-second UGC ad scripts</p>

      <div className="generator-controls">
        <div className="form-group">
          <label>Script Duration</label>
          <select value={scriptType} onChange={(e) => setScriptType(e.target.value)}>
            <option value="15-sec">15 seconds</option>
            <option value="30-sec">30 seconds</option>
            <option value="45-sec">45 seconds</option>
            <option value="long-form">Long form</option>
          </select>
        </div>

        <div className="form-group">
          <label>Hook Type</label>
          <select value={hookType} onChange={(e) => setHookType(e.target.value)}>
            <option value="frustration">Frustration Hook</option>
            <option value="confession">Confession Hook</option>
            <option value="curiosity">Curiosity Hook</option>
          </select>
        </div>

        <div className="form-group">
          <label>Platform</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            <option value="instagram">Instagram Reels</option>
            <option value="facebook">Facebook</option>
            <option value="youtube">YouTube Shorts</option>
          </select>
        </div>

        <button onClick={generateScript} className="btn-primary" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Script'}
        </button>
      </div>

      {scripts.length > 0 && (
        <div className="output-section">
          <h3>Generated Scripts ({scripts.length})</h3>
          {scripts.map((script, idx) => (
            <div key={idx} className="script-card">
              <div className="script-meta">
                <span className="badge">{script.duration}</span>
                <span className="badge">{script.platform}</span>
              </div>

              <div className="script-content">
                <div className="script-part">
                  <strong>[HOOK]</strong>
                  <p>"{script.hook}"</p>
                </div>

                <div className="script-part">
                  <strong>[PROBLEM]</strong>
                  <p>{script.problem}</p>
                </div>

                <div className="script-part">
                  <strong>[DISCOVERY]</strong>
                  <p>{script.discovery}</p>
                </div>

                <div className="script-part">
                  <strong>[RESULT]</strong>
                  <p>{script.result}</p>
                </div>

                <div className="script-part">
                  <strong>[CTA]</strong>
                  <p>"{script.cta}"</p>
                </div>
              </div>

              <div className="script-actions">
                <button
                  onClick={() => saveScript(script)}
                  className="btn-secondary"
                >
                  Save Script
                </button>
                <button
                  onClick={() => downloadScript(script)}
                  className="btn-secondary"
                >
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScriptGenerator;
