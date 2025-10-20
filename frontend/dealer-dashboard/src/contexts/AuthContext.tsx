import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import type { User, LoginRequestDTO } from '../types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: LoginRequestDTO) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  hasRole: (roles: string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start unauthenticated by default for demo login flow
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // TODO: Uncomment when backend is ready
  /*
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user từ localStorage khi app khởi động
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        } catch (error) {
          console.error('Failed to load user:', error)
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [])
  */

  const login = async (credentials: LoginRequestDTO) => {
    const response = await authService.login(credentials)
    localStorage.setItem('token', response.token)
    localStorage.setItem('refreshToken', response.refreshToken)
    setUser(response.userInfo)
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
  }

  const hasRole = (roles: string[]): boolean => {
    if (!user) return false
    return roles.includes(user.role)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
