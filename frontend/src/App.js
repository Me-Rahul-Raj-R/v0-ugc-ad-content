'use client';

import React, { useState, useEffect } from 'react';
import './App.css';
import ProductForm from './components/ProductForm';
import HookGenerator from './components/HookGenerator';
import ScriptGenerator from './components/ScriptGenerator';
import CTAGenerator from './components/CTAGenerator';
import OutputDisplay from './components/OutputDisplay';

function App() {
  const [currentTab, setCurrentTab] = useState('product');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [apiUrl] = useState('http://localhost:5000/api');

  useEffect(() => {
    console.log('[v0] App initialized');
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/products`);
      const data = await response.json();
      setProducts(data.data || []);
      console.log('[v0] Products fetched:', data.data);
    } catch (error) {
      console.log('[v0] Error fetching products:', error.message);
    }
  };

  const handleProductCreated = () => {
    fetchProducts();
    setCurrentTab('hooks');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🎬 UGC Ad Generator</h1>
        <p>AI-Powered UGC Ad Content System for D2C Brands</p>
      </header>

      <nav className="tabs-nav">
        <button
          className={`tab-btn ${currentTab === 'product' ? 'active' : ''}`}
          onClick={() => setCurrentTab('product')}
        >
          Product Setup
        </button>
        <button
          className={`tab-btn ${currentTab === 'hooks' ? 'active' : ''}`}
          onClick={() => setCurrentTab('hooks')}
        >
          Hooks
        </button>
        <button
          className={`tab-btn ${currentTab === 'scripts' ? 'active' : ''}`}
          onClick={() => setCurrentTab('scripts')}
        >
          Scripts
        </button>
        <button
          className={`tab-btn ${currentTab === 'cta' ? 'active' : ''}`}
          onClick={() => setCurrentTab('cta')}
        >
          CTAs
        </button>
        <button
          className={`tab-btn ${currentTab === 'output' ? 'active' : ''}`}
          onClick={() => setCurrentTab('output')}
        >
          Output
        </button>
      </nav>

      <div className="content-area">
        {currentTab === 'product' && (
          <ProductForm onProductCreated={handleProductCreated} products={products} />
        )}
        {currentTab === 'hooks' && selectedProduct && (
          <HookGenerator product={selectedProduct} />
        )}
        {currentTab === 'scripts' && selectedProduct && (
          <ScriptGenerator product={selectedProduct} />
        )}
        {currentTab === 'cta' && selectedProduct && (
          <CTAGenerator product={selectedProduct} />
        )}
        {currentTab === 'output' && (
          <OutputDisplay product={selectedProduct} />
        )}
      </div>
    </div>
  );
}

export default App;
