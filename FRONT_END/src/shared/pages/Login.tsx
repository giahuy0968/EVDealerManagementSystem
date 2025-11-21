import { useState, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ username, password })
      
      // Get user from localStorage to determine role
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        
        // Navigate based on role
        const roleRouteMap: Record<string, string> = {
          'ADMIN': '/admin',
          'DEALER_MANAGER': '/dealer-manager',
          'DEALER_STAFF': '/dealer-staff',
          'EVM_STAFF': '/evm-staff',
        }
        
        const targetRoute = roleRouteMap[user.role] || '/login'
        const from = (location.state as any)?.from?.pathname || targetRoute
        navigate(from, { replace: true })
      }
    } catch (err: any) {
      console.error('Login error:', err)
      
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        setError('❌ Không thể kết nối tới server. Vui lòng kiểm tra API Gateway (port 8080).')
      } else if (err.response) {
        // Server responded with error
        setError(`❌ ${err.response?.data?.message || err.response?.data?.error || 'Đăng nhập thất bại'}`)
      } else if (err.request) {
        // Request made but no response
        setError('❌ Server không phản hồi. Vui lòng kiểm tra Auth Service.')
      } else {
        setError(`❌ ${err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🚗 EVDMS</h1>
        <p className="text-center" style={{ color: '#6b7280', marginBottom: '32px' }}>
          Hệ thống quản lý đại lý xe điện
        </p>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
            style={{ marginTop: '24px', padding: '12px' }}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div style={{ marginTop: '32px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>
            Tài khoản demo:
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            👑 Admin: <strong>admin / password123</strong>
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            🏪 Quản lý đại lý: <strong>manager / password123</strong>
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280' }}>
            👤 Nhân viên: <strong>staff / password123</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
