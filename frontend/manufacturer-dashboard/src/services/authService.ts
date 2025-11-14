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
    // Backend expects 'username' field (can accept email as value)
    const loginPayload = {
      username: credentials.email || credentials.username,
      password: credentials.password
    }

    const response = await api.post('/api/v1/auth/login', loginPayload)
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
