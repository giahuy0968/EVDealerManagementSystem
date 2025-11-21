import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import authService, { LoginCredentials, User } from '../services/authService'
import { mockUsers, DEMO_PASSWORD } from '../utils/mockData'

// Enable demo mode when backend is not available
const DEMO_MODE = false

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken')
      const storedUser = localStorage.getItem('user')

      if (accessToken && storedUser) {
        try {
          await authService.verify()
          setUser(JSON.parse(storedUser))
          setIsAuthenticated(true)
        } catch (error) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    if (DEMO_MODE) {
      // Mock login for demo
      const user = mockUsers[credentials.username as keyof typeof mockUsers]
      
      if (!user || credentials.password !== DEMO_PASSWORD) {
        throw new Error('Invalid credentials')
      }
      
      const mockAccessToken = 'mock-access-token-' + Date.now()
      const mockRefreshToken = 'mock-refresh-token-' + Date.now()
      
      localStorage.setItem('accessToken', mockAccessToken)
      localStorage.setItem('refreshToken', mockRefreshToken)
      localStorage.setItem('user', JSON.stringify(user))
      
      setUser(user as User)
      setIsAuthenticated(true)
      return
    }
    
    // Real backend login
    const data = await authService.login(credentials)
    
    // Backend returns 'token' but we need 'accessToken'
    const accessToken = data.accessToken || data.token
    const refreshToken = data.refreshToken
    
    // Construct user object from response
    const user: User = {
      id: data.userId,
      username: credentials.username,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      isActive: true,
      createdAt: new Date().toISOString()
    }
    
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    
    setUser(user)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
