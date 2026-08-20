import React, { useState, useEffect, useCallback, useRef } from 'react';

function ScriptGenerator({ product, showToast }) {
  const [duration, setDuration] = useState('30-sec');
  const [angle, setAngle] = useState('frustration');
  const [platform, setPlatform] = useState('instagram');
  const [generatedScript, setGeneratedScript] = useState(null);
  const [savedScripts, setSavedScripts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Teleprompter state
  const [teleprompterOpen, setTeleprompterOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2);
  const teleprompterRef = useRef(null);

  const fetchSavedScripts = useCallback(async () => {
    if (!product) return;
    try {
      const res = await fetch(`http://localhost:5000/api/scripts/product/${product._id || product.id}`);
      const data = await res.json();
      if (data.success) {
        setSavedScripts(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching scripts:', err);
    }
  }, [product]);

  useEffect(() => {
    fetchSavedScripts();
  }, [fetchSavedScripts]);

  // Teleprompter auto-scroll effect
  useEffect(() => {
    let interval = null;
    if (teleprompterOpen && isPlaying) {
      interval = setInterval(() => {
        if (teleprompterRef.current) {
          teleprompterRef.current.scrollTop += scrollSpeed;
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [teleprompterOpen, isPlaying, scrollSpeed]);

  const generateScript = () => {
    if (!product) {
      showToast('Please select a product first!', true);
      return;
    }
    setLoading(true);

    const pName = product.name || 'this product';
    const pPrice = product.price || 'affordable';
    const pain1 = product.targetAudience?.painPoints?.[0] || 'excessive daily hair loss';
    const pain2 = product.targetAudience?.painPoints?.[1] || 'sticky greasy residue from normal products';
    const usp1 = product.usp?.[0] || 'visible results in 21 days';
    const usp2 = product.usp?.[1] || 'lightweight non-greasy formula';

    const scriptTemplates = {
      frustration: {
        title: `30s Relatable Problem-to-Solution UGC Ad`,
        hook: `Every single shower meant another handful of hair falling out.`,
        problem: `I was honestly so frustrated with ${pain1}. I spent hundreds on expensive salon treatments and ${pain2}, but my scalp just felt more damaged and irritated.`,
        discovery: `Then a friend recommended ${pName}. What made me try it was that it's specifically formulated with ${usp2}.`,
        result: `After using 3 drops every evening for 3 weeks: ${usp1}. My comb barely catches any hair now, and my scalp feels completely rejuvenated.`,
        cta: `If ${pain1} is stressing you out every day, check the link below — they have a special offer right now.`,
        visualCues: `[0:00-0:04] Close-up selfie holding comb in bathroom, looking genuinely tired/worried\n[0:04-0:10] B-roll of bathroom sink & cluttered shelf of rejected products\n[0:10-0:18] Applying 3 clear drops of ${pName} directly on scalp parted with fingers\n[0:18-0:25] Smiling in bright morning window light, running fingers freely through thick hair\n[0:25-0:30] Holding up bottle of ${pName} smiling at camera`,
        audioCues: `Gentle conversational bedroom acoustic track in background with clear front-facing microphone voiceover`
      },
      confession: {
        title: `30s Skeptic Honest Review UGC Ad`,
        hook: `I honestly thought ${pName} was another overhyped Instagram gimmick.`,
        problem: `I have bought at least 5 different viral products promising to fix ${pain1}, and literally none of them delivered. I had zero expectations when ordering this for ${pPrice}.`,
        discovery: `But looking at the ingredient list, ${pName} focuses on ${usp2} without heavy fragrances or silicones.`,
        result: `3 weeks in, and here is my actual density. The shedding stopped, and baby hairs are visibly coming in. It proved me completely wrong.`,
        cta: `Just being honest because it worked for me. I left the exact link in my bio if you want to inspect it.`,
        visualCues: `[0:00-0:04] Creator holding phone with skepticism face, looking at package\n[0:04-0:10] Opening package and showing lightweight texture on back of hand\n[0:10-0:18] Night routine application on scalp\n[0:18-0:25] Side-by-side photo comparison of hairline\n[0:25-0:30] Thumbs up with product bottle`,
        audioCues: `Conversational, unfiltered vocal delivery with quiet lofi chill beat`
      },
      transformation: {
        title: `30s High-Energy Proof UGC Ad`,
        hook: `Stop using heavy products for ${pain1} — look at my 21-day difference!`,
        problem: `For months, ${pain1} was destroying my confidence every time I styled my hair.`,
        discovery: `I switched exclusively to ${pName} because of ${usp2}.`,
        result: `Here is unedited day 1 versus day 21. ${usp1}! The difference is night and day.`,
        cta: `Tap the link right now to grab yours before their stock sells out again!`,
        visualCues: `[0:00-0:05] High-energy selfie snap cut to day 1 vs day 21 photo\n[0:05-0:12] Quick macro zoom of healthy bouncy roots\n[0:12-0:20] Demonstrating super quick 10-second bedtime application\n[0:20-0:25] 360 spin in natural sunlight showing volume\n[0:25-0:30] Pointing down with graphic overlay pointing to link`,
        audioCues: `Upbeat, modern pop-electronic instrumental track at medium volume`
      }
    };

    setTimeout(() => {
      const template = scriptTemplates[angle] || scriptTemplates.frustration;
      setGeneratedScript({
        ...template,
        duration,
        platform
      });
      setLoading(false);
      showToast('Generated complete UGC Video Ad Script! 🎬');
    }, 250);
  };

  const saveScriptToMySQL = async () => {
    if (!generatedScript || !product) return;
    setSaving(true);

    try {
      const response = await fetch('http://localhost:5000/api/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id || product.id,
          scriptType: duration,
          title: generatedScript.title,
          script: generatedScript,
          platform,
          visualCues: generatedScript.visualCues,
          audioCues: generatedScript.audioCues
        })
      });

      const data = await response.json();
      if (data.success) {
        showToast('Script saved to MySQL database! 💾');
        fetchSavedScripts();
      } else {
        showToast(data.error || 'Failed to save script', true);
      }
    } catch (err) {
      showToast('Error saving script to MySQL', true);
    } finally {
      setSaving(false);
    }
  };

  const deleteScriptFromMySQL = async (scriptId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/scripts/${scriptId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        showToast('Script deleted from MySQL');
        fetchSavedScripts();
      }
    } catch (err) {
      showToast('Error deleting script', true);
    }
  };

  const copyFullScript = (s) => {
    const fullText = `TITLE: ${s.title} (${s.duration || duration})\nPLATFORM: ${s.platform || platform}\n\n[HOOK (0-3s)]\n"${s.hook}"\n\n[PROBLEM (3-10s)]\n${s.problem}\n\n[DISCOVERY (10-18s)]\n${s.discovery}\n\n[RESULT / PROOF (18-25s)]\n${s.result}\n\n[SOFT CTA (25-30s)]\n"${s.cta}"\n\n[VISUAL SCENE DIRECTIONS]\n${s.visualCues || s.script?.visualCues}\n\n[AUDIO DIRECTIONS]\n${s.audioCues || s.script?.audioCues}`;
    navigator.clipboard.writeText(fullText);
    showToast('Full UGC Script copied to clipboard! 📋');
  };

  const downloadScriptFile = (s) => {
    const fullText = `# UGC Video Ad Script: ${s.title}\n**Brand:** ${product?.name || 'D2C Brand'}\n**Duration:** ${s.duration || duration} | **Platform:** ${s.platform || platform}\n\n---\n\n### 1. HOOK [0:00 - 0:03]\n> "${s.hook}"\n\n### 2. PROBLEM [0:03 - 0:10]\n${s.problem}\n\n### 3. DISCOVERY [0:10 - 0:18]\n${s.discovery}\n\n### 4. RESULT & PROOF [0:18 - 0:25]\n${s.result}\n\n### 5. CALL TO ACTION [0:25 - 0:30]\n> "${s.cta}"\n\n---\n\n### 🎬 CREATOR PRODUCTION NOTES\n**Visual Scenes:**\n${s.visualCues || s.script?.visualCues}\n\n**Audio Cues:**\n${s.audioCues || s.script?.audioCues}\n`;

    const blob = new Blob([fullText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `UGC-Script-${(product?.name || 'ad').replace(/\s+/g, '-')}-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded script as Markdown file! 📥');
  };

  return (
    <div className="script-studio">
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">
              <span>📝</span> UGC Script Studio & Teleprompter
            </h2>
            <p className="panel-desc">
              Generate structured, high-converting 5-part UGC video scripts with scene-by-scene creator directions.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Script Duration</label>
            <select value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="15-sec">15 Seconds (Fast Hook + Direct Offer)</option>
              <option value="30-sec">30 Seconds (Standard High-Converting UGC)</option>
              <option value="45-sec">45 Seconds (Deep Story & Demonstration)</option>
              <option value="60-sec">60 Seconds (Full Product Breakdown)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Creative Angle</label>
            <select value={angle} onChange={(e) => setAngle(e.target.value)}>
              <option value="frustration">Frustration to Relief (Bathroom Routine)</option>
              <option value="confession">Skeptic Converted (Honest Unboxing Review)</option>
              <option value="transformation">Before & After Proof (High Energy)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Target Platform</label>
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              <option value="instagram">Instagram Reels (9:16)</option>
              <option value="tiktok">TikTok Video (9:16)</option>
              <option value="youtube">YouTube Shorts (9:16)</option>
            </select>
          </div>
        </div>

        <button onClick={generateScript} className="btn-primary" disabled={loading}>
          {loading ? 'Generating UGC Script...' : '🎬 Generate 30s UGC Ad Script'}
        </button>
      </div>

      {/* Generated Script Display */}
      {generatedScript && (
        <div className="glass-panel">
          <div className="script-header-bar">
            <div>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '800' }}>
                {generatedScript.title}
              </h3>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <span className="badge badge-purple">{generatedScript.duration}</span>
                <span className="badge badge-emerald">{generatedScript.platform}</span>
                <span className="badge badge-amber">{angle} angle</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  setTeleprompterOpen(true);
                  setIsPlaying(false);
                }}
              >
                📺 Open Teleprompter
              </button>
              <button className="btn-secondary" onClick={() => copyFullScript(generatedScript)}>
                📋 Copy Script
              </button>
              <button className="btn-secondary" onClick={() => downloadScriptFile(generatedScript)}>
                📥 Download .MD
              </button>
              <button className="btn-primary" onClick={saveScriptToMySQL} disabled={saving}>
                {saving ? 'Saving...' : '💾 Save to MySQL'}
              </button>
            </div>
          </div>

          <div className="script-card-full">
            <div className="script-timeline-step">
              <div className="step-label">1. HOOK (0:00 - 0:03) — Scroll Stopper</div>
              <div className="step-dialogue">"{generatedScript.hook}"</div>
            </div>

            <div className="script-timeline-step">
              <div className="step-label">2. PROBLEM (0:03 - 0:10) — Relatable Struggle</div>
              <div className="step-dialogue">{generatedScript.problem}</div>
            </div>

            <div className="script-timeline-step">
              <div className="step-label">3. DISCOVERY (0:10 - 0:18) — Why This Product Is Different</div>
              <div className="step-dialogue">{generatedScript.discovery}</div>
            </div>

            <div className="script-timeline-step">
              <div className="step-label">4. RESULT & PROOF (0:18 - 0:25) — Tangible Transformation</div>
              <div className="step-dialogue">{generatedScript.result}</div>
            </div>

            <div className="script-timeline-step">
              <div className="step-label">5. CALL TO ACTION (0:25 - 0:30) — Trust-Based Soft CTA</div>
              <div className="step-dialogue">"{generatedScript.cta}"</div>
            </div>

            <div className="cue-box">
              <strong style={{ color: '#c4b5fd' }}>🎬 Creator Visual Scenes:</strong>
              <p style={{ whiteSpace: 'pre-line', marginTop: '4px' }}>{generatedScript.visualCues}</p>
            </div>

            <div className="cue-box">
              <strong style={{ color: '#93c5fd' }}>🎵 Audio Direction:</strong>
              <p style={{ marginTop: '4px' }}>{generatedScript.audioCues}</p>
            </div>
          </div>
        </div>
      )}

      {/* Saved Scripts from MySQL */}
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <span>💾</span> Saved Scripts in MySQL ({savedScripts.length})
            </h3>
            <p className="panel-desc">Scripts saved in table `scripts` for {product?.name || 'this product'}.</p>
          </div>
        </div>

        {savedScripts.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No saved scripts in database yet.</p>
        ) : (
          savedScripts.map((s) => {
            const sc = s.script || {};
            return (
              <div key={s._id || s.id} className="script-card-full" style={{ marginBottom: '18px' }}>
                <div className="script-header-bar">
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>{s.title}</h4>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <span className="badge badge-purple">{s.duration}</span>
                      <span className="badge badge-blue">{s.platform}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      className="btn-primary"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => {
                        setGeneratedScript({
                          title: s.title,
                          duration: s.duration,
                          platform: s.platform,
                          hook: sc.hook || '',
                          problem: sc.problem || '',
                          discovery: sc.discovery || '',
                          result: sc.result || '',
                          cta: sc.cta || '',
                          visualCues: sc.visualCues || '',
                          audioCues: sc.audioCues || ''
                        });
                        setTeleprompterOpen(true);
                      }}
                    >
                      📺 Teleprompter
                    </button>
                    <button
                      className="btn-outline"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() =>
                        copyFullScript({
                          title: s.title,
                          duration: s.duration,
                          platform: s.platform,
                          ...sc
                        })
                      }
                    >
                      Copy
                    </button>
                    <button
                      className="btn-danger"
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                      onClick={() => deleteScriptFromMySQL(s._id || s.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="script-timeline-step">
                  <div className="step-label">Hook</div>
                  <div className="step-dialogue">"{sc.hook}"</div>
                </div>
                <div className="script-timeline-step">
                  <div className="step-label">Problem</div>
                  <div className="step-dialogue">{sc.problem}</div>
                </div>
                <div className="script-timeline-step">
                  <div className="step-label">Discovery</div>
                  <div className="step-dialogue">{sc.discovery}</div>
                </div>
                <div className="script-timeline-step">
                  <div className="step-label">Result</div>
                  <div className="step-dialogue">{sc.result}</div>
                </div>
                <div className="script-timeline-step">
                  <div className="step-label">CTA</div>
                  <div className="step-dialogue">"{sc.cta}"</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Teleprompter Modal */}
      {teleprompterOpen && (
        <div className="teleprompter-overlay">
          <div className="teleprompter-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
                📺 Creator Teleprompter Mode
              </span>
              <button
                className="btn-primary"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? '⏸ Pause' : '▶ Play Scroll'}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontSize: '13px' }}>
                <span>Speed:</span>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(Number(e.target.value))}
                  style={{ width: '80px' }}
                />
              </div>
            </div>
            <button className="btn-danger" onClick={() => setTeleprompterOpen(false)}>
              ✕ Close Teleprompter
            </button>
          </div>

          <div className="teleprompter-box" ref={teleprompterRef}>
            {generatedScript && (
              <div className="teleprompter-text">
                <p style={{ color: '#818cf8', marginBottom: '24px' }}>
                  [HOOK]<br />"{generatedScript.hook}"
                </p>
                <p style={{ color: '#e2e8f0', marginBottom: '24px' }}>
                  [PROBLEM]<br />{generatedScript.problem}
                </p>
                <p style={{ color: '#38bdf8', marginBottom: '24px' }}>
                  [DISCOVERY]<br />{generatedScript.discovery}
                </p>
                <p style={{ color: '#4ade80', marginBottom: '24px' }}>
                  [RESULT]<br />{generatedScript.result}
                </p>
                <p style={{ color: '#f472b6', marginBottom: '24px' }}>
                  [CTA]<br />"{generatedScript.cta}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ScriptGenerator;
