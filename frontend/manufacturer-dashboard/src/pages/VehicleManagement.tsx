import { useState } from 'react'

export default function VehicleManagement() {
  const [activeTab, setActiveTab] = useState('products')

  // Mock data
  const products = [
    {
      id: '1',
      name: 'Tesla Model 3',
      version: 'Standard Range',
      price: 45000,
      status: 'ACTIVE',
      totalProduced: 2500,
      inStock: 150
    },
    {
      id: '2',
      name: 'Tesla Model Y',
      version: 'Long Range',
      price: 55000,
      status: 'ACTIVE',
      totalProduced: 1800,
      inStock: 89
    },
    {
      id: '3',
      name: 'Nissan Leaf',
      version: 'e+ 62kWh',
      price: 32000,
      status: 'ACTIVE',
      totalProduced: 3200,
      inStock: 45
    }
  ]

  const [showAddModal, setShowAddModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    version: '',
    price: '',
    batteryCapacity: '',
    range: '',
    seats: '5'
  })

  const handleAddProduct = () => {
    console.log('Adding product:', newProduct)
    setShowAddModal(false)
    setNewProduct({
      name: '',
      version: '',
      price: '',
      batteryCapacity: '',
      range: '',
      seats: '5'
    })
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🚙 Vehicle Management</h1>
        <p>Manage vehicle models, specifications, and production data</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          🚗 Products
        </button>
        <button 
          className={`tab ${activeTab === 'specifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('specifications')}
        >
          📋 Specifications
        </button>
        <button 
          className={`tab ${activeTab === 'production' ? 'active' : ''}`}
          onClick={() => setActiveTab('production')}
        >
          🏭 Production
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="content-section">
          <div className="section-header">
            <h2>Product Catalog</h2>
            <button 
              className="btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              ➕ Add New Product
            </button>
          </div>

          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Version</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Total Produced</th>
                  <th>Current Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td><strong>{product.name}</strong></td>
                    <td>{product.version}</td>
                    <td>${product.price.toLocaleString()}</td>
                    <td>
                      <span className={`status ${product.status.toLowerCase()}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>{product.totalProduced.toLocaleString()}</td>
                    <td>
                      <span className={product.inStock < 50 ? 'text-warning' : 'text-success'}>
                        {product.inStock}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-secondary">✏️ Edit</button>
                        <button className="btn-secondary">📊 View Details</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'specifications' && (
        <div className="content-section">
          <h2>📋 Vehicle Specifications</h2>
          <div className="specs-grid">
            {products.map(product => (
              <div key={product.id} className="spec-card">
                <h3>{product.name} - {product.version}</h3>
                <div className="spec-details">
                  <div className="spec-item">
                    <span className="spec-label">🔋 Battery:</span>
                    <span>75 kWh</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">🛣️ Range:</span>
                    <span>450 km</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">🏃 0-100 km/h:</span>
                    <span>5.8s</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">👥 Seats:</span>
                    <span>5</span>
                  </div>
                </div>
                <button className="btn-secondary full-width">✏️ Edit Specs</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'production' && (
        <div className="content-section">
          <h2>🏭 Production Overview</h2>
          <div className="production-stats">
            <div className="production-card">
              <h3>📊 Monthly Production</h3>
              <div className="production-chart">
                <p className="large-number">2,580</p>
                <p className="trend positive">↗️ +15% from last month</p>
              </div>
            </div>
            <div className="production-card">
              <h3>🎯 Production Target</h3>
              <div className="production-chart">
                <p className="large-number">3,000</p>
                <p className="trend neutral">86% completed</p>
              </div>
            </div>
            <div className="production-card">
              <h3>⚡ Production Rate</h3>
              <div className="production-chart">
                <p className="large-number">125</p>
                <p className="trend positive">units/day</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Add New Product</h3>
              <button 
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Tesla Model S"
                  />
                </div>
                <div className="form-group">
                  <label>Version</label>
                  <input
                    type="text"
                    value={newProduct.version}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="e.g. Plaid"
                  />
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="45000"
                  />
                </div>
                <div className="form-group">
                  <label>Battery Capacity (kWh)</label>
                  <input
                    type="number"
                    value={newProduct.batteryCapacity}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, batteryCapacity: e.target.value }))}
                    placeholder="75"
                  />
                </div>
                <div className="form-group">
                  <label>Range (km)</label>
                  <input
                    type="number"
                    value={newProduct.range}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, range: e.target.value }))}
                    placeholder="450"
                  />
                </div>
                <div className="form-group">
                  <label>Seats</label>
                  <select
                    value={newProduct.seats}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, seats: e.target.value }))}
                  >
                    <option value="2">2 seats</option>
                    <option value="4">4 seats</option>
                    <option value="5">5 seats</option>
                    <option value="7">7 seats</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleAddProduct}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}