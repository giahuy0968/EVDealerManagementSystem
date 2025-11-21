import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      await logout()
    }
  }

  const getRoleName = (role: string) => {
    const roleMap: Record<string, string> = {
      'ADMIN': 'Quản trị viên',
      'DEALER_MANAGER': 'Quản lý đại lý',
      'DEALER_STAFF': 'Nhân viên đại lý',
      'EVM_STAFF': 'Nhân viên hãng',
    }
    return roleMap[role] || role
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>🚗 EVDMS</h2>
          <p style={{ fontSize: '12px', color: '#b8b8d1', marginTop: '8px' }}>
            {getRoleName(user?.role || '')}
          </p>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            📊 Trang chủ
          </NavLink>

          {(user?.role === 'ADMIN' || user?.role === 'DEALER_MANAGER') && (
            <NavLink to="/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              👥 Quản lý người dùng
            </NavLink>
          )}

          <NavLink to="/customers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            🧑‍💼 Quản lý khách hàng
          </NavLink>

          <NavLink to="/leads" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            🎯 Quản lý Leads
          </NavLink>

          <NavLink to="/test-drives" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            🚙 Lịch lái thử
          </NavLink>

          <NavLink to="/feedbacks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            💬 Phản hồi & Khiếu nại
          </NavLink>
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #2d2d44' }}>
          <div style={{ marginBottom: '12px', fontSize: '14px' }}>
            <strong>{user?.fullName}</strong>
            <div style={{ fontSize: '12px', color: '#b8b8d1' }}>{user?.email}</div>
          </div>
          <button onClick={handleLogout} className="btn btn-danger w-full btn-sm">
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="top-bar">
          <h1 style={{ fontSize: '20px', fontWeight: '600' }}>
            Hệ thống quản lý đại lý xe điện
          </h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              {new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
