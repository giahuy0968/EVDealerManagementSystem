import { useState } from 'react'

export default function DealerManagement() {
  const [dealers] = useState([
    {
      id: '1',
      name: 'EV Motors Downtown',
      code: 'EVD001',
      region: 'New York',
      status: 'ACTIVE',
      totalSales: 1250000,
      contractExpiry: '2024-12-31'
    },
    {
      id: '2',
      name: 'Green Auto Center',
      code: 'GAC001',
      region: 'California',
      status: 'ACTIVE',
      totalSales: 2100000,
      contractExpiry: '2025-06-30'
    },
    {
      id: '3',
      name: 'EcoWheels Texas',
      code: 'EWT001',
      region: 'Texas',
      status: 'PENDING',
      totalSales: 0,
      contractExpiry: '2025-03-15'
    }
  ])

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🏪 Dealer Management</h1>
        <p>Manage dealer partnerships, contracts, and performance</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-content">
            <h3>Active Dealers</h3>
            <p className="stat-number">45</p>
            <span className="stat-change positive">+3 this month</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Sales</h3>
            <p className="stat-number">$12.5M</p>
            <span className="stat-change positive">+18%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Best Performer</h3>
            <p className="stat-number">GAC001</p>
            <span className="stat-change neutral">California</span>
          </div>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Dealer Network</h2>
          <button className="btn-primary">➕ Add New Dealer</button>
        </div>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Dealer Name</th>
                <th>Code</th>
                <th>Region</th>
                <th>Status</th>
                <th>Total Sales</th>
                <th>Contract Expiry</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dealers.map(dealer => (
                <tr key={dealer.id}>
                  <td><strong>{dealer.name}</strong></td>
                  <td>{dealer.code}</td>
                  <td>{dealer.region}</td>
                  <td>
                    <span className={`status ${dealer.status.toLowerCase()}`}>
                      {dealer.status}
                    </span>
                  </td>
                  <td>${dealer.totalSales.toLocaleString()}</td>
                  <td>{dealer.contractExpiry}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-secondary">👀 View</button>
                      <button className="btn-secondary">✏️ Edit</button>
                      <button className="btn-secondary">📄 Contract</button>
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