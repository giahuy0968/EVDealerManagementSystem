export default function Reports() {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📈 Reports & Analytics</h1>
        <p>Comprehensive business intelligence and performance analytics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Monthly Revenue</h3>
            <p className="stat-number">$8.2M</p>
            <span className="stat-change positive">+15% MoM</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-content">
            <h3>Units Sold</h3>
            <p className="stat-number">2,580</p>
            <span className="stat-change positive">+12%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <h3>Active Dealers</h3>
            <p className="stat-number">45</p>
            <span className="stat-change positive">+3 new</span>
          </div>
        </div>
      </div>

      <div className="content-section">
        <h2>📊 Sales Performance</h2>
        <div className="chart-placeholder">
          <p>📈 Sales chart will be displayed here</p>
          <p>Showing monthly trends, top products, and regional performance</p>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Quick Reports</h2>
          <button className="btn-primary">📄 Custom Report</button>
        </div>

        <div className="reports-grid">
          <div className="report-card">
            <h4>📊 Sales Summary</h4>
            <p>Monthly sales performance by region and product</p>
            <button className="btn-secondary">📥 Download</button>
          </div>
          
          <div className="report-card">
            <h4>📦 Inventory Report</h4>
            <p>Current stock levels and distribution status</p>
            <button className="btn-secondary">📥 Download</button>
          </div>
          
          <div className="report-card">
            <h4>🏪 Dealer Performance</h4>
            <p>Individual dealer sales and target achievements</p>
            <button className="btn-secondary">📥 Download</button>
          </div>
          
          <div className="report-card">
            <h4>💰 Financial Overview</h4>
            <p>Revenue, margins, and profitability analysis</p>
            <button className="btn-secondary">📥 Download</button>
          </div>
        </div>
      </div>
    </div>
  )
}