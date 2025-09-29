import { useState } from 'react'
import { api } from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await api.post('/api/v1/auth/login', { email, password })
      setMessage('Logged in! ' + JSON.stringify(res.data))
    } catch (err: any) {
      setMessage(err?.response?.data?.error?.message || 'Login failed')
    }
  }

  return (
    <section>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {message && <pre style={{ marginTop: 12 }}>{message}</pre>}
    </section>
  )
}
