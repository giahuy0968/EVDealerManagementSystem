import { useState } from 'react'

export default function Reports() {
  const [reportType, setReportType] = useState<'sales' | 'inventory' | 'debt'>('sales')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const handleGenerateReport = () => {
    alert('Report generation will be implemented with backend integration')
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Reports & Analytics</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">📤 Export PDF</button>
          <button className="btn btn-primary" onClick={handleGenerateReport}>📊 Generate Report</button>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Report Configuration</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">Report Type</label>
            <select 
              className="form-input"
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
            >
              <option value="sales">Sales Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="debt">Debt Report</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">From Date</label>
            <input 
              type="date" 
              className="form-input"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">To Date</label>
            <input 
              type="date" 
              className="form-input"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">$842K</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#10b981' }}>↑ 12.5% vs last month</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-label">Units Sold</div>
          <div className="stat-value">247</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#10b981' }}>↑ 8.3% growth</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="stat-label">Avg. Sale Value</div>
          <div className="stat-value">$45.2K</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#718096' }}>Per transaction</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="stat-label">Active Customers</div>
          <div className="stat-value">1,234</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#10b981' }}>↑ 156 new</div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Top Selling Models</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Model</th>
                <th>Units Sold</th>
                <th>Revenue</th>
                <th>Avg. Price</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🥇 1</td>
                <td><strong>EV Sport 3000</strong></td>
                <td>87</td>
                <td>$4.2M</td>
                <td>$48K</td>
                <td><span style={{ color: '#10b981' }}>↑ 15%</span></td>
              </tr>
              <tr>
                <td>🥈 2</td>
                <td><strong>Eco Cruiser SUV</strong></td>
                <td>64</td>
                <td>$3.5M</td>
                <td>$55K</td>
                <td><span style={{ color: '#10b981' }}>↑ 8%</span></td>
              </tr>
              <tr>
                <td>🥉 3</td>
                <td><strong>Urban Compact E</strong></td>
                <td>96</td>
                <td>$2.9M</td>
                <td>$30K</td>
                <td><span style={{ color: '#ef4444' }}>↓ 3%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Monthly Performance Chart</h2>
        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7fafc', borderRadius: '8px' }}>
          <p style={{ color: '#a0aec0' }}>📊 Chart visualization will be implemented with Chart.js or Recharts</p>
        </div>
      </div>
    </>
  )
}
