const tests = [ { email: 'demo@manufacturer.com', password: 'demo123' }, { email: 'bad@x', password: 'no' } ]

function mockLogin(creds) {
  const demoUsers = [ { email: 'demo@manufacturer.com', password: 'demo123', userInfo: { id: 'm-1', username: 'Manufacturer Demo', email: 'demo@manufacturer.com', role: 'EVM_STAFF' } } ]
  const found = demoUsers.find(u => u.email === (creds.email || creds.username) && creds.password === u.password)
  if (found) return { ok: true, token: 'demo-token-' + found.userInfo.id, user: found.userInfo }
  return { ok: false }
}

console.log('Running manufacturer login tests...')
for (const t of tests) {
  const res = mockLogin(t)
  console.log(t.email, '=>', res.ok ? 'OK' : 'FAIL', res.ok ? res.user : '')
}
