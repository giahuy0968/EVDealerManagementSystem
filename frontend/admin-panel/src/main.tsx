import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom'
import './index.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'

function Dashboard() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">System Overview</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">Refresh</button>
          <button className="btn btn-danger">System Alerts</button>
        </div>
      </div>
      
      <div className="card-grid">
        <div className="stat-card">
          <div className="stat-label">Total Users</div>
          <div className="stat-value">2,847</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#48bb78' }}>↑ 142 this month</div>
        </div>
        
        <div className="stat-card" style={{ borderLeftColor: '#9f7aea' }}>
          <div className="stat-label">Active Dealers</div>
          <div className="stat-value">156</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#718096' }}>Across 45 cities</div>
        </div>
        
        <div className="stat-card" style={{ borderLeftColor: '#ed8936' }}>
          <div className="stat-label">Total Transactions</div>
          <div className="stat-value">$24.8M</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#48bb78' }}>↑ 18% growth</div>
        </div>
        
        <div className="stat-card" style={{ borderLeftColor: '#f56565' }}>
          <div className="stat-label">System Health</div>
          <div className="stat-value">98.7%</div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#48bb78' }}>All systems operational</div>
        </div>
      </div>
      
      <div className="card">
        <h2 className="card-title">Recent Admin Activities</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Admin</th>
                <th>Action</th>
                <th>Target</th>
                <th>Status</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Super Admin</strong></td>
                <td>User Created</td>
                <td>Dealer Manager #247</td>
                <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Success</span></td>
                <td>2 hours ago</td>
              </tr>
              <tr>
                <td><strong>System Admin</strong></td>
                <td>Database Backup</td>
                <td>Full Backup</td>
                <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Completed</span></td>
                <td>5 hours ago</td>
              </tr>
              <tr>
                <td><strong>Security Admin</strong></td>
                <td>Permission Updated</td>
                <td>Dealer Group #12</td>
                <td><span style={{ background: '#c6f6d5', color: '#22543d', padding: '4px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600 }}>Applied</span></td>
                <td>1 day ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function Users() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <div className="header-actions">
          <button className="btn btn-primary">+ Add User</button>
        </div>
      </div>
      <div className="card">
        <p style={{ color: '#718096' }}>Manage system users, roles, and permissions.</p>
      </div>
    </>
  )
}

function Settings() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">System Settings</h1>
      </div>
      <div className="card">
        <p style={{ color: '#718096' }}>Configure system-wide settings and preferences.</p>
      </div>
    </>
  )
}

function AppContent() {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Login />

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">⚡ EVDMS</div>
          <div style={{ fontSize: '13px', color: '#a0aec0', marginTop: '5px' }}>Admin Control</div>
        </div>
        <nav>
          <ul className="sidebar-nav">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>📊 Dashboard</Link></li>
            <li><Link to="/users" className={location.pathname === '/users' ? 'active' : ''}>👥 Users</Link></li>
            <li><Link to="/dealers">🏢 Dealers</Link></li>
            <li><Link to="/manufacturers">🏭 Manufacturers</Link></li>
            <li><Link to="/transactions">💳 Transactions</Link></li>
            <li><Link to="/reports">📈 Reports</Link></li>
            <li><Link to="/audit">🔍 Audit Logs</Link></li>
            <li><Link to="/settings" className={location.pathname === '/settings' ? 'active' : ''}>⚙️ Settings</Link></li>
          </ul>
        </nav>
      </aside>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
