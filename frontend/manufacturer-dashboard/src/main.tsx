import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'

function Dashboard() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Manufacturer Overview</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">Export</button>
          <button className="btn btn-primary">+ New Model</button>
        </div>
      </div>
      
      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-label">Total Models</div>
          <div className="stat-value">42</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#48bb78' }}>↑ 5 new this year</div>
        </div>
        
        <div className="stat-card" style={{ borderLeftColor: '#48bb78' }}>
          <div className="stat-label">Active Dealers</div>
          <div className="stat-value">156</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#48bb78' }}>↑ 12% growth</div>
        </div>
        
        <div className="stat-card" style={{ borderLeftColor: '#ed8936' }}>
          <div className="stat-label">Production Units</div>
          <div className="stat-value">8,432</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#48bb78' }}>This quarter</div>
        </div>
        
        <div className="stat-card" style={{ borderLeftColor: '#9f7aea' }}>
          <div className="stat-label">Inventory Value</div>
          <div className="stat-value">$12.4M</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#718096' }}>Current stock</div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="card-title">Popular Models</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Model Name</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Price Range</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>EV Sport 3000</strong></td>
                <td>Sedan</td>
                <td>1,247</td>
                <td>$45K - $55K</td>
                <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>In Production</span></td>
              </tr>
              <tr>
                <td><strong>Eco Cruiser SUV</strong></td>
                <td>SUV</td>
                <td>892</td>
                <td>$52K - $68K</td>
                <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>In Production</span></td>
              </tr>
              <tr>
                <td><strong>Urban Compact E</strong></td>
                <td>Hatchback</td>
                <td>2,134</td>
                <td>$28K - $35K</td>
                <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>In Production</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function Models() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Vehicle Models</h1>
        <div className="header-actions">
          <button className="btn btn-primary">+ Add Model</button>
        </div>
      </div>
      <div className="card">
        <p style={{ color: '#718096' }}>Manage your vehicle model catalog here.</p>
      </div>
    </>
  )
}

function Dealers() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dealer Network</h1>
        <div className="header-actions">
          <button className="btn btn-primary">+ Add Dealer</button>
        </div>
      </div>
      <div className="card">
        <p style={{ color: '#718096' }}>View and manage your dealer partnerships.</p>
      </div>
    </>
  )
}

function App() {
  const location = useLocation()
  
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">🏭 EVDMS</div>
          <div style={{ fontSize: '13px', color: '#a0aec0', marginTop: '5px' }}>Manufacturer Portal</div>
        </div>
        <nav>
          <ul className="sidebar-nav">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>📊 Dashboard</Link></li>
            <li><Link to="/models" className={location.pathname === '/models' ? 'active' : ''}>🚗 Models</Link></li>
            <li><Link to="/dealers" className={location.pathname === '/dealers' ? 'active' : ''}>🏢 Dealers</Link></li>
            <li><Link to="/production">⚙️ Production</Link></li>
            <li><Link to="/inventory">📦 Inventory</Link></li>
            <li><Link to="/analytics">📈 Analytics</Link></li>
            <li><Link to="/settings">⚙️ Settings</Link></li>
          </ul>
        </nav>
      </aside>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/models" element={<Models />} />
          <Route path="/dealers" element={<Dealers />} />
        </Routes>
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
