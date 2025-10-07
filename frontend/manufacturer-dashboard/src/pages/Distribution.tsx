export default function Distribution() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🚚 Distribution</h1>
        <p>Manage vehicle distribution to dealers nationwide</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-content">
            <h3>In Transit</h3>
            <p className="stat-number">156</p>
            <span className="stat-change neutral">vehicles</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Ready to Ship</h3>
            <p className="stat-number">89</p>
            <span className="stat-change positive">units</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Delivered Today</h3>
            <p className="stat-number">42</p>
            <span className="stat-change positive">+15%</span>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>🗺️ Distribution Map</h2>
        <div className="map-placeholder">
          <p>📍 Interactive distribution map will be displayed here</p>
          <p>Showing dealer locations, shipping routes, and delivery status</p>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Recent Shipments</h2>
          <button className="btn-primary">📋 Schedule New Shipment</button>
        </div>
        
        <div className="shipment-list">
          <div className="shipment-item">
            <div className="shipment-info">
              <h4>Shipment #SH-2024-001</h4>
              <p>25 x Model 3 → EV Motors Downtown (NY)</p>
              <span className="shipment-status in-transit">🚚 In Transit</span>
            </div>
            <div className="shipment-actions">
              <button className="btn-secondary">📱 Track</button>
            </div>
          </div>
          
          <div className="shipment-item">
            <div className="shipment-info">
              <h4>Shipment #SH-2024-002</h4>
              <p>15 x Model Y → Green Auto Center (CA)</p>
              <span className="shipment-status delivered">✅ Delivered</span>
            </div>
            <div className="shipment-actions">
              <button className="btn-secondary">📄 Receipt</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}