import { useEffect, useState } from 'react'
import authService from '../../shared/services/authService'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalDealers: 0,
    totalCustomers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const users = await authService.getUsers()
      setStats({
        totalUsers: users.data?.length || 0,
        activeUsers: users.data?.filter((u: any) => u.isActive).length || 0,
        totalDealers: 0, // TODO: Implement when dealer service ready
        totalCustomers: 0, // TODO: Implement when customer service ready
      })
    } catch (error) {
      console.error('Load stats error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading-spinner"></div>
  }

  return (
    <div>
      <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '24px' }}>
        📊 Tổng quan hệ thống
      </h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Tổng người dùng</div>
          <div className="stat-value">{stats.totalUsers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Người dùng hoạt động</div>
          <div className="stat-value" style={{ color: '#10b981' }}>{stats.activeUsers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Đại lý</div>
          <div className="stat-value">{stats.totalDealers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Khách hàng</div>
          <div className="stat-value">{stats.totalCustomers}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Hoạt động gần đây</h3>
        </div>
        <p style={{ color: '#6b7280' }}>Chức năng đang được phát triển...</p>
      </div>
    </div>
  )
}
