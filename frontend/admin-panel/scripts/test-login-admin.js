// Simple demo login test for admin
const credentials = { email: 'admin@evdms.com', password: 'admin123' }

function testAdminLogin(creds) {
  if ((creds.email === 'admin@evdms.com' || creds.username === 'admin@evdms.com') && creds.password === 'admin123') {
    return {
      ok: true,
      token: 'admin-demo-token',
      user: { id: 'a-1', username: 'Admin Demo', email: 'admin@evdms.com', role: 'ADMIN' }
    }
  }
  return { ok: false }
}

console.log('Running admin login test...')
const res = testAdminLogin(credentials)
if (res.ok) console.log('LOGIN OK', res) ; else console.log('LOGIN FAILED')
