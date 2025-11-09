import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(credentials)
      navigate('/')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setCredentials({
      email: 'demo@manufacturer.com',
      password: 'demo123'
    })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🏭 EVDMS</h1>
          <h2>Manufacturer Portal</h2>
          <p>Sign in to access EVM Staff dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="login-button">
            {loading ? '⏳ Signing in...' : '🔑 Sign In'}
          </button>

          <button type="button" onClick={handleDemoLogin} className="demo-button">
            🎭 Demo Login
          </button>
        </form>

        <div className="login-footer">
          <p>EVM Staff Portal - Electric Vehicle Management System</p>
          <p>For manufacturer representatives and admins</p>
        </div>
      </div>
    </div>
  )
}