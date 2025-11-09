import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Vehicles from './pages/Vehicles'
import Customers from './pages/Customers'
import Orders from './pages/Orders'
import Quotations from './pages/Quotations'
import TestDrives from './pages/TestDrives'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  // Show full layout with sidebar for authenticated routes
  const isLoginPage = location.pathname === '/login'
  
  if (isLoginPage) {
    return <Login />
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Role-based menu filtering
  const getMenuItems = () => {
    const allItems = [
      { path: '/', label: '📊 Dashboard', roles: ['DEALER_STAFF', 'DEALER_MANAGER'] },
      { path: '/vehicles', label: '🚙 Vehicles', roles: ['DEALER_STAFF', 'DEALER_MANAGER'] },
      { path: '/customers', label: '👥 Customers', roles: ['DEALER_STAFF', 'DEALER_MANAGER'] },
      { path: '/orders', label: '📦 Orders', roles: ['DEALER_MANAGER'] },
      { path: '/quotations', label: '💰 Quotations', roles: ['DEALER_STAFF', 'DEALER_MANAGER'] },
      { path: '/test-drives', label: '🔑 Test Drives', roles: ['DEALER_STAFF', 'DEALER_MANAGER'] },
      { path: '/inventory', label: '📋 Inventory', roles: ['DEALER_MANAGER'] },
      { path: '/reports', label: '📈 Reports', roles: ['DEALER_MANAGER'] },
    ]

    return allItems.filter(item => !user || item.roles.includes(user.role))
  }
  
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">🚗 EVDMS</div>
          <div style={{ fontSize: '13px', color: '#a0aec0', marginTop: '5px' }}>Dealer Dashboard</div>
          {user && (
            <div style={{ fontSize: '12px', color: '#cbd5e0', marginTop: '10px', padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
              👤 {user.username}<br/>
              <span style={{ fontSize: '11px', color: '#a0aec0' }}>{user.role.replace('_', ' ')}</span>
            </div>
          )}
        </div>
        <nav>
          <ul className="sidebar-nav">
            {getMenuItems().map(item => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li><a onClick={handleLogout} style={{ cursor: 'pointer' }}>🔐 Logout</a></li>
          </ul>
        </nav>
      </aside>
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['DEALER_STAFF', 'DEALER_MANAGER']}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/vehicles" element={
            <ProtectedRoute allowedRoles={['DEALER_STAFF', 'DEALER_MANAGER']}>
              <Vehicles />
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute allowedRoles={['DEALER_STAFF', 'DEALER_MANAGER']}>
              <Customers />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={['DEALER_MANAGER']}>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/quotations" element={
            <ProtectedRoute allowedRoles={['DEALER_STAFF', 'DEALER_MANAGER']}>
              <Quotations />
            </ProtectedRoute>
          } />
          <Route path="/test-drives" element={
            <ProtectedRoute allowedRoles={['DEALER_STAFF', 'DEALER_MANAGER']}>
              <TestDrives />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute allowedRoles={['DEALER_MANAGER']}>
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['DEALER_MANAGER']}>
              <Reports />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}
