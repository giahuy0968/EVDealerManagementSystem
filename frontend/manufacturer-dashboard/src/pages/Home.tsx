import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user } = useAuth()

  // Mock data for EVM Staff Dashboard
  const stats = {
    totalProducts: 12,
    activeDealers: 45,
    monthlyProduction: 2580,
    pendingDistribution: 156
  }

  const recentActivities = [
    { id: 1, type: 'Production', message: 'Model Y production completed - 250 units', time: '2 hours ago' },
    { id: 2, type: 'Dealer', message: 'New dealer onboarded - EV Motors NYC', time: '4 hours ago' },
    { id: 3, type: 'Distribution', message: '45 vehicles shipped to West Coast dealers', time: '6 hours ago' },
    { id: 4, type: 'Pricing', message: 'Q4 pricing policy updated for Model 3', time: '1 day ago' }
  ]

  const lowStockProducts = [
    { name: 'Model 3 - White', stock: 12, target: 50 },
    { name: 'Model Y - Blue', stock: 8, target: 30 },
    { name: 'Leaf - Silver', stock: 5, target: 25 }
  ]

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🏭 EVM Staff Dashboard</h1>
        <p>Welcome back, {user?.username}! Here's your manufacturer overview.</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚙</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-number">{stats.totalProducts}</p>
            <span className="stat-change positive">+2 this month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <h3>Active Dealers</h3>
            <p className="stat-number">{stats.activeDealers}</p>
            <span className="stat-change positive">+3 new</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏭</div>
          <div className="stat-content">
            <h3>Monthly Production</h3>
            <p className="stat-number">{stats.monthlyProduction.toLocaleString()}</p>
            <span className="stat-change positive">+12%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Pending Distribution</h3>
            <p className="stat-number">{stats.pendingDistribution}</p>
            <span className="stat-change neutral">Ready to ship</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Activities */}
        <div className="dashboard-section">
          <h2>📋 Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-type">{activity.type}</div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="dashboard-section">
          <h2>⚠️ Low Stock Alert</h2>
          <div className="stock-alerts">
            {lowStockProducts.map((product, index) => (
              <div key={index} className="stock-alert-item">
                <div className="stock-info">
                  <h4>{product.name}</h4>
                  <div className="stock-bar">
                    <div 
                      className="stock-fill" 
                      style={{ width: `${(product.stock / product.target) * 100}%` }}
                    ></div>
                  </div>
                  <span className="stock-text">{product.stock} / {product.target} units</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn primary">
            <span>🚙</span>
            Add New Product
          </button>
          <button className="action-btn secondary">
            <span>🏪</span>
            Manage Dealers
          </button>
          <button className="action-btn secondary">
            <span>📊</span>
            Generate Report
          </button>
          <button className="action-btn secondary">
            <span>🚚</span>
            Schedule Distribution
          </button>
        </div>
      </div>
    </div>
  )
}