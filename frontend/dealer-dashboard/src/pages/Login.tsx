import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      await login({ email, password })
      setMessage('✅ Login successful!')
      setTimeout(() => navigate('/'), 1000)
    } catch (err: any) {
      setMessage('❌ ' + (err?.response?.data?.error?.message || 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">🚗 EVDMS</h1>
        <p className="form-subtitle">Dealer Dashboard Login</p>
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              className="form-input"
              type="email"
              placeholder="dealer@evdms.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              className="form-input"
              type="password"
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
        
        {message && (
          <div className={message.includes('✅') ? 'alert alert-success' : 'alert alert-error'}>
            {message}
          </div>
        )}
        
        <p style={{ marginTop: '20px', textAlign: 'center', color: '#718096', fontSize: '14px' }}>
          Demo: dealer@evdms.com / password123
        </p>
      </div>
    </div>
  )
}
