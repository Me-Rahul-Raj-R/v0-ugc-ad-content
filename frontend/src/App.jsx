import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import ProductForm from './components/ProductForm';
import HookGenerator from './components/HookGenerator';
import ScriptGenerator from './components/ScriptGenerator';
import CTAGenerator from './components/CTAGenerator';
import PromptMatrix from './components/PromptMatrix';
import OutputDisplay from './components/OutputDisplay';

function App() {
  const [currentTab, setCurrentTab] = useState('product');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dbStatus, setDbStatus] = useState({ connected: false, loading: true });
  const [showDbModal, setShowDbModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const fetchDbStatus = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/db-status');
      const data = await res.json();
      setDbStatus({ ...data, loading: false });
    } catch (err) {
      setDbStatus({
        connected: false,
        loading: false,
        error: 'Cannot reach backend server on port 5000'
      });
    }
  }, []);

  const fetchProducts = useCallback(async (autoSelectNewId = null) => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      const productList = data.data || [];
      setProducts(productList);

      if (autoSelectNewId) {
        const found = productList.find(p => (p._id || p.id) === autoSelectNewId);
        if (found) setSelectedProduct(found);
      } else if (productList.length > 0 && !selectedProduct) {
        setSelectedProduct(productList[0]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [selectedProduct]);

  useEffect(() => {
    fetchDbStatus();
    fetchProducts();
    const interval = setInterval(fetchDbStatus, 15000);
    return () => clearInterval(interval);
  }, [fetchDbStatus, fetchProducts]);

  const handleProductCreated = (newProd) => {
    fetchProducts(newProd ? (newProd._id || newProd.id) : null);
    if (newProd) {
      setSelectedProduct(newProd);
    }
    fetchDbStatus();
  };

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    showToast(`Active product switched to: ${prod.name}`);
  };

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toast && (
        <div
          className="toast-msg"
          style={{
            borderColor: toast.isError ? '#f43f5e' : '#6366f1',
            background: toast.isError ? '#2a1215' : '#1e293b'
          }}
        >
          {toast.isError ? '⚠️ ' : '✅ '}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo">🎬</div>
          <div className="brand-title">
            <h1>UGC Ad Content Studio</h1>
            <p>AI-Powered High-Converting UGC Generator • MySQL Workbench Connected</p>
          </div>
        </div>

        <div className="header-actions">
          <div
            className={`mysql-badge ${!dbStatus.connected ? 'disconnected' : ''}`}
            onClick={() => setShowDbModal(true)}
            title="Click to view MySQL Workbench connection details"
          >
            <span className={`status-dot ${!dbStatus.connected ? 'red' : ''}`}></span>
            <span>
              {dbStatus.loading
                ? 'Connecting MySQL...'
                : dbStatus.connected
                ? `MySQL: ${dbStatus.database || 'ugc_ads_db'} (Port ${dbStatus.port || 3306})`
                : 'MySQL Offline (Click)'}
            </span>
          </div>
        </div>
      </header>

      {/* Active Working Product Banner */}
      {selectedProduct && (
        <div className="product-context-bar">
          <div className="context-info">
            <span className="context-label">Active Working Brand:</span>
            <span className="context-name">✨ {selectedProduct.name}</span>
            <span className="badge badge-purple">{selectedProduct.category}</span>
            <span className="badge badge-emerald">{selectedProduct.price}</span>
          </div>

          <div className="context-selector">
            <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Switch Product:</span>
            <select
              className="product-select-dropdown"
              value={selectedProduct._id || selectedProduct.id}
              onChange={(e) => {
                const prod = products.find(p => (p._id || p.id) === Number(e.target.value) || (p._id || p.id) === e.target.value);
                if (prod) handleSelectProduct(prod);
              }}
            >
              {products.map(p => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <nav className="tabs-nav">
        <button
          className={`tab-btn ${currentTab === 'product' ? 'active' : ''}`}
          onClick={() => setCurrentTab('product')}
        >
          <span>📦</span> Products <span className="tab-badge">{products.length}</span>
        </button>

        <button
          className={`tab-btn ${currentTab === 'hooks' ? 'active' : ''}`}
          onClick={() => setCurrentTab('hooks')}
        >
          <span>🎣</span> Viral Hooks
        </button>

        <button
          className={`tab-btn ${currentTab === 'scripts' ? 'active' : ''}`}
          onClick={() => setCurrentTab('scripts')}
        >
          <span>📝</span> Script Studio & Teleprompter
        </button>

        <button
          className={`tab-btn ${currentTab === 'cta' ? 'active' : ''}`}
          onClick={() => setCurrentTab('cta')}
        >
          <span>📢</span> CTA Vault
        </button>

        <button
          className={`tab-btn ${currentTab === 'prompts' ? 'active' : ''}`}
          onClick={() => setCurrentTab('prompts')}
        >
          <span>🤖</span> AI Prompt Matrix
        </button>

        <button
          className={`tab-btn ${currentTab === 'output' ? 'active' : ''}`}
          onClick={() => setCurrentTab('output')}
        >
          <span>📊</span> MySQL Campaign Vault
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="content-area">
        {currentTab === 'product' && (
          <ProductForm
            onProductCreated={handleProductCreated}
            products={products}
            selectedProduct={selectedProduct}
            onSelectProduct={handleSelectProduct}
            showToast={showToast}
          />
        )}

        {currentTab === 'hooks' && (
          <HookGenerator
            product={selectedProduct}
            showToast={showToast}
          />
        )}

        {currentTab === 'scripts' && (
          <ScriptGenerator
            product={selectedProduct}
            showToast={showToast}
          />
        )}

        {currentTab === 'cta' && (
          <CTAGenerator
            product={selectedProduct}
            showToast={showToast}
          />
        )}

        {currentTab === 'prompts' && (
          <PromptMatrix
            product={selectedProduct}
            showToast={showToast}
          />
        )}

        {currentTab === 'output' && (
          <OutputDisplay
            product={selectedProduct}
            showToast={showToast}
          />
        )}
      </main>

      {/* MySQL Connection Diagnostics Modal */}
      {showDbModal && (
        <div
          className="teleprompter-overlay"
          style={{ justifyContent: 'center', alignItems: 'center' }}
          onClick={() => setShowDbModal(false)}
        >
          <div
            className="glass-panel"
            style={{ maxWidth: '580px', width: '100%', margin: '0 20px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="panel-header">
              <h3 className="panel-title">
                <span>🐬</span> MySQL Workbench Database Status
              </h3>
              <button className="btn-outline" onClick={() => setShowDbModal(false)}>
                ✕ Close
              </button>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span className={`status-dot ${!dbStatus.connected ? 'red' : ''}`}></span>
                <strong style={{ color: dbStatus.connected ? '#34d399' : '#f43f5e' }}>
                  {dbStatus.connected ? 'Connected to MySQL Server' : 'MySQL Not Connected'}
                </strong>
              </div>

              <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '14px', borderRadius: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                <p><strong>Host:</strong> {dbStatus.host || '127.0.0.1'}</p>
                <p><strong>Port:</strong> {dbStatus.port || 3306}</p>
                <p><strong>Database / Schema:</strong> {dbStatus.database || 'ugc_ads_db'}</p>
                <p><strong>User:</strong> {dbStatus.user || 'root'}</p>
                {dbStatus.mysqlVersion && <p><strong>MySQL Version:</strong> {dbStatus.mysqlVersion}</p>}
                {dbStatus.stats && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <p><strong>Stored Products:</strong> {dbStatus.stats.products}</p>
                    <p><strong>Stored Hooks:</strong> {dbStatus.stats.hooks}</p>
                    <p><strong>Stored Scripts:</strong> {dbStatus.stats.scripts}</p>
                    <p><strong>Stored CTAs:</strong> {dbStatus.stats.ctas}</p>
                  </div>
                )}
              </div>
            </div>

            {!dbStatus.connected && (
              <div className="cue-box" style={{ borderColor: 'rgba(244, 63, 94, 0.3)', color: '#fb7185' }}>
                <p><strong>Connection Troubleshooting:</strong></p>
                <p style={{ marginTop: '4px' }}>1. Ensure MySQL Server is running on port 3306.</p>
                <p>2. If your root user has a password, update `DB_PASSWORD` in `backend/.env`.</p>
                <p>3. You can also execute the SQL schema in `database/schema.sql` directly inside MySQL Workbench.</p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '18px' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  fetchDbStatus();
                  showToast('Checking MySQL connection...');
                }}
              >
                🔄 Test Connection Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
