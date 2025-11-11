import React, { createContext, useContext, useState } from 'react'
import { authService } from '../services/authService'
import type { User, LoginRequestDTO } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginRequestDTO) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const login = async (credentials: LoginRequestDTO) => {
    setLoading(true)
    const res = await authService.login(credentials)
    localStorage.setItem('token', res.token)
    localStorage.setItem('refreshToken', res.refreshToken)
    setUser(res.userInfo)
    setLoading(false)
  }

  const logout = async () => {
    await authService.logout()
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
