export default function Customers() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Customer Management</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">Export</button>
          <button className="btn btn-primary">+ Add Customer</button>
        </div>
      </div>
      
      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-label">Total Customers</div>
          <div className="stat-value">1,843</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#48bb78' }}>
          <div className="stat-label">New This Month</div>
          <div className="stat-value">127</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#ed8936' }}>
          <div className="stat-label">Active Leads</div>
          <div className="stat-value">84</div>
        </div>
      </div>
      
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Interest</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>John Doe</strong></td>
                <td>john.doe@email.com</td>
                <td>+1 234-567-8901</td>
                <td>Tesla Model 3</td>
                <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Active</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>View</button>
                </td>
              </tr>
              <tr>
                <td><strong>Jane Smith</strong></td>
                <td>jane.smith@email.com</td>
                <td>+1 234-567-8902</td>
                <td>Nissan Leaf</td>
                <td><span style={{ background: '#feebc8', color: '#744210', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Lead</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>View</button>
                </td>
              </tr>
              <tr>
                <td><strong>Bob Johnson</strong></td>
                <td>bob.j@email.com</td>
                <td>+1 234-567-8903</td>
                <td>Hyundai Ioniq 5</td>
                <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Active</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>View</button>
                </td>
              </tr>
              <tr>
                <td><strong>Alice Williams</strong></td>
                <td>alice.w@email.com</td>
                <td>+1 234-567-8904</td>
                <td>Ford Mustang Mach-E</td>
                <td><span style={{ background: '#feebc8', color: '#744210', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Lead</span></td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
