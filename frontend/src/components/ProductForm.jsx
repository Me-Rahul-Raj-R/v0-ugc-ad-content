import React, { useState } from 'react';

function ProductForm({ onProductCreated, products, selectedProduct, onSelectProduct, showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'd2c',
    price: '₹699',
    targetAudience: {
      ageRange: '20-35',
      gender: 'Men & Women',
      region: 'India',
      painPoints: []
    },
    usp: [],
    platform: ['instagram', 'youtube'],
    brand: {
      tone: 'honest, relatable, empathetic'
    }
  });

  const [painPointInput, setPainPointInput] = useState('');
  const [uspInput, setUspInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPainPoint = (e) => {
    if (e) e.preventDefault();
    if (painPointInput.trim()) {
      setFormData(prev => ({
        ...prev,
        targetAudience: {
          ...prev.targetAudience,
          painPoints: [...prev.targetAudience.painPoints, painPointInput.trim()]
        }
      }));
      setPainPointInput('');
    }
  };

  const handleRemovePainPoint = (index) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        painPoints: prev.targetAudience.painPoints.filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddUSP = (e) => {
    if (e) e.preventDefault();
    if (uspInput.trim()) {
      setFormData(prev => ({
        ...prev,
        usp: [...prev.usp, uspInput.trim()]
      }));
      setUspInput('');
    }
  };

  const handleRemoveUSP = (index) => {
    setFormData(prev => ({
      ...prev,
      usp: prev.usp.filter((_, i) => i !== index)
    }));
  };

  const handleEditProduct = (prod) => {
    setIsEditing(true);
    setEditId(prod._id || prod.id);
    setFormData({
      name: prod.name || '',
      description: prod.description || '',
      category: prod.category || 'd2c',
      price: prod.price || '₹699',
      targetAudience: {
        ageRange: prod.targetAudience?.ageRange || '20-35',
        gender: prod.targetAudience?.gender || 'Men & Women',
        region: prod.targetAudience?.region || 'India',
        painPoints: prod.targetAudience?.painPoints || []
      },
      usp: prod.usp || [],
      platform: prod.platform || ['instagram'],
      brand: {
        tone: prod.brand?.tone || 'honest, relatable'
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (prodId, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this product from MySQL?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/products/${prodId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        showToast('Product deleted from MySQL database');
        onProductCreated();
      }
    } catch (err) {
      showToast('Error deleting product', true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEditing
        ? `http://localhost:5000/api/products/${editId}`
        : 'http://localhost:5000/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        showToast(isEditing ? 'Product updated in MySQL' : 'New Product created in MySQL!');
        setIsEditing(false);
        setEditId(null);
        setFormData({
          name: '',
          description: '',
          category: 'd2c',
          price: '₹699',
          targetAudience: {
            ageRange: '20-35',
            gender: 'Men & Women',
            region: 'India',
            painPoints: []
          },
          usp: [],
          platform: ['instagram', 'youtube'],
          brand: { tone: 'honest, relatable' }
        });
        onProductCreated(data.data);
      } else {
        showToast(data.error || 'Failed to save product', true);
      }
    } catch (error) {
      showToast('Error connecting to MySQL server', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-studio">
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">
              <span>📦</span> {isEditing ? 'Edit Product Setup' : 'Create New D2C Brand / Product'}
            </h2>
            <p className="panel-desc">
              All details are automatically stored in your <strong>MySQL database</strong> schema.
            </p>
          </div>
          {isEditing && (
            <button
              className="btn-outline"
              onClick={() => {
                setIsEditing(false);
                setEditId(null);
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. FolliBoost Scalp Serum"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="d2c">D2C Physical Product</option>
                <option value="beauty">Skincare / Beauty</option>
                <option value="health">Health & Wellness</option>
                <option value="saas">SaaS / Mobile App</option>
                <option value="local-business">Local Business / Clinic</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price / Offer</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g. ₹699 / $29"
              />
            </div>

            <div className="form-group">
              <label>Brand Tone</label>
              <input
                type="text"
                value={formData.brand.tone}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, brand: { tone: e.target.value } }))
                }
                placeholder="honest, relatable, conversational"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Description & Main Benefit *</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="What does the product do? What is the main transformation customer experiences?"
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Target Audience Demographics</label>
              <input
                type="text"
                value={formData.targetAudience.gender}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    targetAudience: { ...prev.targetAudience, gender: e.target.value }
                  }))
                }
                placeholder="e.g. Men & Women, 20-35"
              />
            </div>

            <div className="form-group">
              <label>Target Region</label>
              <input
                type="text"
                value={formData.targetAudience.region}
                onChange={(e) =>
                  setFormData(prev => ({
                    ...prev,
                    targetAudience: { ...prev.targetAudience, region: e.target.value }
                  }))
                }
                placeholder="e.g. India, Tier 1/2 Cities"
              />
            </div>
          </div>

          {/* Pain Points Section */}
          <div className="form-group">
            <label>Core Customer Pain Points (What keeps them up at night?)</label>
            <div className="input-with-button">
              <input
                type="text"
                value={painPointInput}
                onChange={(e) => setPainPointInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPainPoint(e)}
                placeholder="e.g. Clumps of hair fall in morning shower"
              />
              <button type="button" onClick={handleAddPainPoint} className="btn-secondary">
                + Add Pain Point
              </button>
            </div>
            <div className="tags-wrap">
              {formData.targetAudience.painPoints.map((point, idx) => (
                <span key={idx} className="tag-chip">
                  🔥 {point}
                  <span className="remove-tag" onClick={() => handleRemovePainPoint(idx)}>
                    ×
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Unique Selling Points (USPs) */}
          <div className="form-group">
            <label>Unique Selling Points (USPs & Proof)</label>
            <div className="input-with-button">
              <input
                type="text"
                value={uspInput}
                onChange={(e) => setUspInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddUSP(e)}
                placeholder="e.g. Visible reduction in 21 days with 3% Redensyl"
              />
              <button type="button" onClick={handleAddUSP} className="btn-secondary">
                + Add USP
              </button>
            </div>
            <div className="tags-wrap">
              {formData.usp.map((usp, idx) => (
                <span key={idx} className="tag-chip">
                  ✨ {usp}
                  <span className="remove-tag" onClick={() => handleRemoveUSP(idx)}>
                    ×
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving to MySQL...' : isEditing ? 'Update Product in MySQL' : '🚀 Save Product to MySQL'}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Products List */}
      <div className="glass-panel">
        <div className="panel-header">
          <div>
            <h3 className="panel-title">
              <span>📋</span> Configured Products in MySQL ({products.length})
            </h3>
            <p className="panel-desc">Click any product to set as the active working brand.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No products in database yet. Create one above!</p>
        ) : (
          <div className="cards-grid">
            {products.map((prod) => {
              const isSelected = selectedProduct && (selectedProduct._id === prod._id || selectedProduct.id === prod.id);
              return (
                <div
                  key={prod._id || prod.id}
                  className="hook-card"
                  style={{
                    borderColor: isSelected ? 'var(--primary)' : 'var(--border-subtle)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-surface-elevated)',
                    cursor: 'pointer'
                  }}
                  onClick={() => onSelectProduct(prod)}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>{prod.name}</h4>
                      <span className="badge badge-purple">{prod.category}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '8px 0' }}>
                      {prod.description}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '8px 0' }}>
                      <span className="badge badge-emerald">{prod.price}</span>
                      <span className="badge badge-blue">{prod.brand?.tone || 'Authentic'}</span>
                    </div>
                  </div>

                  <div className="hook-meta">
                    <span style={{ fontSize: '12px', color: isSelected ? '#a5b4fc' : 'var(--text-dim)', fontWeight: '600' }}>
                      {isSelected ? '✓ Active Working Product' : 'Click to Select'}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        className="btn-outline"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditProduct(prod);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-danger"
                        style={{ padding: '4px 8px', fontSize: '11px' }}
                        onClick={(e) => handleDeleteProduct(prod._id || prod.id, e)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductForm;
