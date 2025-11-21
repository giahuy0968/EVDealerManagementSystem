import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface RoleBasedRouteProps {
  children: React.ReactNode
  allowedRoles: string[]
}

export default function RoleBasedRoute({ children, allowedRoles }: RoleBasedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const roleRouteMap: Record<string, string> = {
      'ADMIN': '/admin',
      'DEALER_MANAGER': '/dealer-manager',
      'DEALER_STAFF': '/dealer-staff',
      'EVM_STAFF': '/evm-staff',
    }
    return <Navigate to={roleRouteMap[user.role] || '/login'} replace />
  }

  return <>{children}</>
}
