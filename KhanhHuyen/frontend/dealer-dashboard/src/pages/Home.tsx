export default function Home() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">Export</button>
          <button className="btn btn-primary">+ New Order</button>
        </div>
      </div>
      
      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-label">Total Vehicles</div>
          <div className="stat-value">247</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#48bb78' }}>↑ 12% from last month</div>
        </div>
        
        <div className="stat-card" style={{ borderLeftColor: '#48bb78' }}>
          <div className="stat-label">Active Customers</div>
          <div className="stat-value">1,843</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#48bb78' }}>↑ 8% from last month</div>
        </div>
        
        <div className="stat-card" style={{ borderLeftColor: '#ed8936' }}>
          <div className="stat-label">Pending Orders</div>
          <div className="stat-value">32</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#718096' }}>→ No change</div>
        </div>
        
        <div className="stat-card" style={{ borderLeftColor: '#9f7aea' }}>
          <div className="stat-label">Revenue (This Month)</div>
          <div className="stat-value">$842K</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#48bb78' }}>↑ 23% from last month</div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="card-title">Recent Activity</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>Tesla Model 3</td>
                <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Completed</span></td>
                <td>$45,000</td>
                <td>Oct 1, 2025</td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>Nissan Leaf</td>
                <td><span style={{ background: '#feebc8', color: '#744210', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Pending</span></td>
                <td>$32,000</td>
                <td>Sep 30, 2025</td>
              </tr>
              <tr>
                <td>Bob Johnson</td>
                <td>Hyundai Ioniq 5</td>
                <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Completed</span></td>
                <td>$48,500</td>
                <td>Sep 29, 2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
