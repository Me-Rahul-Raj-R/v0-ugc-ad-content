'use client';

import React, { useState } from 'react';

function ProductForm({ onProductCreated, products }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'd2c',
    price: '',
    targetAudience: {
      ageRange: '20-35',
      gender: '',
      region: 'India',
      painPoints: []
    },
    usp: [],
    platform: ['instagram'],
    brand: {
      tone: 'honest, friendly'
    }
  });

  const [uspInput, setUspInput] = useState('');
  const [painPointInput, setPainPointInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUSP = () => {
    if (uspInput.trim()) {
      setFormData(prev => ({
        ...prev,
        usp: [...prev.usp, uspInput]
      }));
      setUspInput('');
    }
  };

  const handleAddPainPoint = () => {
    if (painPointInput.trim()) {
      setFormData(prev => ({
        ...prev,
        targetAudience: {
          ...prev.targetAudience,
          painPoints: [...prev.targetAudience.painPoints, painPointInput]
        }
      }));
      setPainPointInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        console.log('[v0] Product created:', data.data);
        alert('Product created successfully!');
        setFormData({
          name: '',
          description: '',
          category: 'd2c',
          price: '',
          targetAudience: {
            ageRange: '20-35',
            gender: '',
            region: 'India',
            painPoints: []
          },
          usp: [],
          platform: ['instagram'],
          brand: { tone: 'honest, friendly' }
        });
        onProductCreated();
      }
    } catch (error) {
      console.log('[v0] Error creating product:', error.message);
      alert('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>📦 Create Product/Business</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Hair Growth Serum"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="What is this product about?"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleInputChange}>
              <option value="d2c">D2C Product</option>
              <option value="local-business">Local Business</option>
              <option value="saas">SaaS Tool</option>
              <option value="creator-brand">Creator Brand</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="₹699"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age Range</label>
            <input
              type="text"
              value={formData.targetAudience.ageRange}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                targetAudience: { ...prev.targetAudience, ageRange: e.target.value }
              }))}
              placeholder="20-35"
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <input
              type="text"
              value={formData.targetAudience.gender}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                targetAudience: { ...prev.targetAudience, gender: e.target.value }
              }))}
              placeholder="Men & Women"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Pain Points</label>
          <div className="input-group">
            <input
              type="text"
              value={painPointInput}
              onChange={(e) => setPainPointInput(e.target.value)}
              placeholder="e.g., Hair fall"
            />
            <button type="button" onClick={handleAddPainPoint}>Add</button>
          </div>
          <div className="tags">
            {formData.targetAudience.painPoints.map((point, idx) => (
              <span key={idx} className="tag">{point}</span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Unique Selling Points</label>
          <div className="input-group">
            <input
              type="text"
              value={uspInput}
              onChange={(e) => setUspInput(e.target.value)}
              placeholder="e.g., Reduces hair fall in 30 days"
            />
            <button type="button" onClick={handleAddUSP}>Add</button>
          </div>
          <div className="tags">
            {formData.usp.map((point, idx) => (
              <span key={idx} className="tag">{point}</span>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>

      <div className="products-list">
        <h3>Your Products</h3>
        {products.length > 0 ? (
          products.map(product => (
            <div key={product._id} className="product-card">
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <span className="badge">{product.category}</span>
            </div>
          ))
        ) : (
          <p>No products created yet</p>
        )}
      </div>
    </div>
  );
}

export default ProductForm;
