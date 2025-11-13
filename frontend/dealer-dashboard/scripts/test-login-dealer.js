const tests = [
  { email: 'dealer@evdms.com', password: 'password123' },
  { email: 'staff@evdms.com', password: 'password123' },
  { email: 'wrong@x', password: 'nope' }
]

function mockLogin(creds) {
  const demoUsers = [
    { email: 'dealer@evdms.com', password: 'password123', userInfo: { id: 'd-1', username: 'Dealer Demo', email: 'dealer@evdms.com', role: 'DEALER_MANAGER' } },
    { email: 'staff@evdms.com', password: 'password123', userInfo: { id: 'd-2', username: 'Dealer Staff', email: 'staff@evdms.com', role: 'DEALER_STAFF' } }
  ]
  const found = demoUsers.find(u => u.email === (creds.email || creds.username) && creds.password === u.password)
  if (found) return { ok: true, token: 'demo-token-' + found.userInfo.id, user: found.userInfo }
  return { ok: false }
}

console.log('Running dealer login tests...')
for (const t of tests) {
  const res = mockLogin(t)
  console.log(t.email, '=>', res.ok ? 'OK' : 'FAIL', res.ok ? res.user : '')
}
