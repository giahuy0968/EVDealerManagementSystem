export default function Inventory() {
  const inventoryData = [
    { product: 'Model 3 - White', factory: 'Fremont', quantity: 245, status: 'IN_STOCK' },
    { product: 'Model Y - Blue', factory: 'Austin', quantity: 89, status: 'LOW_STOCK' },
    { product: 'Leaf - Silver', factory: 'Smyrna', quantity: 12, status: 'LOW_STOCK' },
    { product: 'Model 3 - Black', factory: 'Shanghai', quantity: 567, status: 'IN_STOCK' }
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Inventory & Stock</h1>
        <p>Monitor factory inventory and stock levels across all locations</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Units</h3>
            <p className="stat-number">913</p>
            <span className="stat-change positive">Ready to ship</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Low Stock Items</h3>
            <p className="stat-number">2</p>
            <span className="stat-change warning">Need attention</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏭</div>
          <div className="stat-content">
            <h3>Production Rate</h3>
            <p className="stat-number">125</p>
            <span className="stat-change positive">units/day</span>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Current Inventory</h2>
          <button className="btn-primary">📊 Generate Report</button>
        </div>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Factory Location</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, index) => (
                <tr key={index}>
                  <td><strong>{item.product}</strong></td>
                  <td>{item.factory}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <span className={`status ${item.status.toLowerCase().replace('_', '-')}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-secondary">🚚 Distribute</button>
                      <button className="btn-secondary">📋 Details</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}