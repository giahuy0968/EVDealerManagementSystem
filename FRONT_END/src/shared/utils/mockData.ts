// Mock users for demo
export const mockUsers = {
  'admin': {
    id: '1',
    username: 'admin',
    email: 'admin@evdms.com',
    fullName: 'Administrator',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  'manager': {
    id: '2',
    username: 'manager',
    email: 'manager@evdms.com',
    fullName: 'Nguyễn Văn Quản Lý',
    role: 'DEALER_MANAGER',
    dealerId: 'dealer-1',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  'staff': {
    id: '3',
    username: 'staff',
    email: 'staff@evdms.com',
    fullName: 'Trần Thị Nhân Viên',
    role: 'DEALER_STAFF',
    dealerId: 'dealer-1',
    isActive: true,
    createdAt: new Date().toISOString(),
  },
}

export const DEMO_PASSWORD = 'password123'
