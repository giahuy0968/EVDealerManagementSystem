import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login({ email, password })
      navigate('/')
    } catch (err: any) {
      setError('Đăng nhập thất bại: ' + (err?.message || 'Unknown'))
    } finally {
      setLoading(false)
    }
  }

  const demoAdmin = () => {
    setEmail('admin@evdms.com')
    setPassword('admin123')
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">⚡ EVDMS Admin</h1>
        <p className="form-subtitle">Admin Portal Login</p>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <button className="btn btn-primary" disabled={loading}>{loading ? 'Đang...' : 'Đăng nhập'}</button>
        </form>
        <button className="btn btn-secondary" onClick={demoAdmin} style={{ marginTop: '12px' }}>Demo Admin</button>
        <p style={{ marginTop: '12px', color: '#718096' }}>Demo credentials: admin@evdms.com / admin123</p>
      </div>
    </div>
  )
}
