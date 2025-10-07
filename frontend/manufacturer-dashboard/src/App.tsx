import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/contexts/AuthContext'
import ProtectedRoute from 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/components/ProtectedRoute'
import Home from 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/pages/Home'
import Login from 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/pages/Login'
import VehicleManagement from 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/pages/VehicleManagement'
import DealerManagement from 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/pages/DealerManagement'
import Inventory from 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/pages/Inventory'
import Distribution from 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/pages/Distribution'
import Pricing from 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/pages/Pricing'
import Reports from 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/pages/Reports'
import Forecast from 'c:/OOP-BUILD/EVDealerManagementSystem/frontend/manufacturer-dashboard/src/pages/Forecast'

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

  // Role-based menu filtering for EVM Staff
  const getMenuItems = () => {
    const allItems = [
      { path: '/', label: '📊 Dashboard', roles: ['EVM_STAFF', 'ADMIN'] },
      { path: '/vehicles', label: '🚙 Vehicle Management', roles: ['EVM_STAFF', 'ADMIN'] },
      { path: '/dealers', label: '🏪 Dealer Management', roles: ['EVM_STAFF', 'ADMIN'] },
      { path: '/inventory', label: '📦 Inventory & Stock', roles: ['EVM_STAFF', 'ADMIN'] },
      { path: '/distribution', label: '🚚 Distribution', roles: ['EVM_STAFF', 'ADMIN'] },
      { path: '/pricing', label: '💰 Pricing & Promotions', roles: ['EVM_STAFF', 'ADMIN'] },
      { path: '/reports', label: '📈 Reports & Analytics', roles: ['EVM_STAFF', 'ADMIN'] },
      { path: '/forecast', label: '🔮 AI Forecast', roles: ['EVM_STAFF', 'ADMIN'] },
    ]

    return allItems.filter(item => !user || item.roles.includes(user.role))
  }
  
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">🏭 EVDMS</div>
          <div style={{ fontSize: '13px', color: '#a0aec0', marginTop: '5px' }}>Manufacturer Portal</div>
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
            <ProtectedRoute allowedRoles={['EVM_STAFF', 'ADMIN']}>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/vehicles" element={
            <ProtectedRoute allowedRoles={['EVM_STAFF', 'ADMIN']}>
              <VehicleManagement />
            </ProtectedRoute>
          } />
          <Route path="/dealers" element={
            <ProtectedRoute allowedRoles={['EVM_STAFF', 'ADMIN']}>
              <DealerManagement />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute allowedRoles={['EVM_STAFF', 'ADMIN']}>
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="/distribution" element={
            <ProtectedRoute allowedRoles={['EVM_STAFF', 'ADMIN']}>
              <Distribution />
            </ProtectedRoute>
          } />
          <Route path="/pricing" element={
            <ProtectedRoute allowedRoles={['EVM_STAFF', 'ADMIN']}>
              <Pricing />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['EVM_STAFF', 'ADMIN']}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/forecast" element={
            <ProtectedRoute allowedRoles={['EVM_STAFF', 'ADMIN']}>
              <Forecast />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}