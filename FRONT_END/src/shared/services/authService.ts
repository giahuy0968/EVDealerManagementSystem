import apiClient from './api'

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  fullName: string
  role: string
  dealerId?: string
}

export interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: string
  dealerId?: string
  isActive: boolean
  createdAt: string
}

export interface ChangePasswordData {
  oldPassword: string
  newPassword: string
}

const authService = {
  // Authentication
  login: async (credentials: LoginCredentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    return response.data
  },

  logoutAll: async () => {
    const response = await apiClient.post('/auth/logout-all')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    return response.data
  },

  refresh: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken })
    return response.data
  },

  verify: async () => {
    const response = await apiClient.get('/auth/verify')
    return response.data
  },

  // User Management
  register: async (data: RegisterData) => {
    const response = await apiClient.post('/auth/register', data)
    return response.data
  },

  getUsers: async (params?: { page?: number; limit?: number; role?: string }) => {
    const response = await apiClient.get('/auth/users', { params })
    return response.data
  },

  getUserById: async (id: string) => {
    const response = await apiClient.get(`/auth/users/${id}`)
    return response.data
  },

  updateUser: async (id: string, data: Partial<User>) => {
    const response = await apiClient.put(`/auth/users/${id}`, data)
    return response.data
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/auth/users/${id}`)
    return response.data
  },

  changeUserRole: async (id: string, role: string) => {
    const response = await apiClient.put(`/auth/users/${id}/role`, { role })
    return response.data
  },

  changeUserStatus: async (id: string, isActive: boolean) => {
    const response = await apiClient.put(`/auth/users/${id}/status`, { isActive })
    return response.data
  },

  // Password Management
  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email })
    return response.data
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiClient.post('/auth/reset-password', { token, newPassword })
    return response.data
  },

  changePassword: async (data: ChangePasswordData) => {
    const response = await apiClient.post('/auth/change-password', data)
    return response.data
  },

  // Profile Management
  getProfile: async () => {
    const response = await apiClient.get('/auth/profile')
    return response.data
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.put('/auth/profile', data)
    return response.data
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    const response = await apiClient.put('/auth/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Session Management
  getSessions: async () => {
    const response = await apiClient.get('/auth/sessions')
    return response.data
  },

  deleteSession: async (sessionId: string) => {
    const response = await apiClient.delete(`/auth/sessions/${sessionId}`)
    return response.data
  },
}

export default authService
