import { api } from '../lib/api'
import type {
  LoginRequestDTO,
  LoginResponseDTO,
  UserCreateDTO,
  UserResponseDTO,
  UserRole
} from '../types'

export const authService = {
  // Đăng nhập
  login: async (credentials: LoginRequestDTO): Promise<LoginResponseDTO> => {
    // Demo credentials (local UI demo) - return mocked tokens
    const demoUsers = [
      { email: 'dealer@evdms.com', password: 'password123', userInfo: { id: 'd-1', username: 'Dealer Demo', email: 'dealer@evdms.com', role: 'DEALER_MANAGER' } },
      { email: 'staff@evdms.com', password: 'password123', userInfo: { id: 'd-2', username: 'Dealer Staff', email: 'staff@evdms.com', role: 'DEALER_STAFF' } }
    ]

    const found = demoUsers.find(u => u.email === (credentials.email || credentials.username) && credentials.password === u.password)
    if (found) {
      return {
        token: 'demo-token-' + found.userInfo.id,
        refreshToken: 'demo-refresh-' + found.userInfo.id,
        userInfo: found.userInfo as any
      }
    }

    const response = await api.post('/api/v1/auth/login', credentials)
    return response.data
  },

  // Đổi mật khẩu
  changePassword: async (oldPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await api.post('/api/v1/auth/change-password', {
      oldPassword,
      newPassword
    })
    return response.data
  },

  // Đăng xuất
  logout: async (): Promise<void> => {
    await api.post('/api/v1/auth/logout')
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const response = await api.post('/api/v1/auth/refresh', { refreshToken })
    return response.data
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async (): Promise<UserResponseDTO> => {
    const response = await api.get('/api/v1/auth/me')
    return response.data
  },

  // ADMIN: Quản lý users
  getUsers: async (): Promise<UserResponseDTO[]> => {
    const response = await api.get('/api/v1/users')
    return response.data
  },

  createUser: async (data: UserCreateDTO): Promise<UserResponseDTO> => {
    const response = await api.post('/api/v1/users', data)
    return response.data
  },

  updateUser: async (id: string, data: Partial<UserCreateDTO>): Promise<UserResponseDTO> => {
    const response = await api.put(`/api/v1/users/${id}`, data)
    return response.data
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/users/${id}`)
  },

  // Phân quyền user
  assignRoles: async (id: string, roles: UserRole[]): Promise<UserResponseDTO> => {
    const response = await api.put(`/api/v1/users/${id}/roles`, { roles })
    return response.data
  }
}
