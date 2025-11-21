import { useEffect, useState } from 'react'
import authService from '../../shared/services/authService'
import customerService from '../../shared/services/customerService'

export default function DealerManagerDashboard() {
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalCustomers: 0,
    newLeads: 0,
    upcomingTestDrives: 0,
    pendingFeedbacks: 0,
    conversionRate: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [users, customers, leads, testDrives, feedbacks] = await Promise.all([
        authService.getUsers({ role: 'DEALER_STAFF' }).catch(() => ({ data: [] })),
        customerService.getCustomers().catch(() => ({ data: [] })),
        customerService.getLeads().catch(() => ({ data: [] })),
        customerService.getTestDrives().catch(() => ({ data: [] })),
        customerService.getFeedbacks({ isResolved: false }).catch(() => ({ data: [] })),
      ])

      const totalLeads = leads.data?.length || 0
      const convertedLeads = leads.data?.filter((l: any) => l.status === 'CONVERTED').length || 0

      setStats({
        totalStaff: users.data?.length || 0,
        totalCustomers: customers.data?.length || 0,
        newLeads: leads.data?.filter((l: any) => l.status === 'NEW').length || 0,
        upcomingTestDrives: testDrives.data?.filter((t: any) => t.status === 'SCHEDULED' || t.status === 'CONFIRMED').length || 0,
        pendingFeedbacks: feedbacks.data?.length || 0,
        conversionRate: totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0,
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
        📊 Tổng quan đại lý
      </h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Tổng nhân viên</div>
          <div className="stat-value">{stats.totalStaff}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Tổng khách hàng</div>
          <div className="stat-value" style={{ color: '#10b981' }}>{stats.totalCustomers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Leads mới</div>
          <div className="stat-value" style={{ color: '#3b82f6' }}>{stats.newLeads}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Tỷ lệ chuyển đổi</div>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>{stats.conversionRate}%</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Hoạt động gần đây</h3>
          </div>
          <p style={{ color: '#6b7280' }}>Danh sách hoạt động sẽ được hiển thị ở đây...</p>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Thông báo</h3>
          </div>
          <div className="alert alert-warning" style={{ marginBottom: '12px' }}>
            <strong>⚠️ {stats.pendingFeedbacks}</strong> phản hồi chưa xử lý
          </div>
          <div className="alert alert-info">
            <strong>📅 {stats.upcomingTestDrives}</strong> lịch lái thử sắp tới
          </div>
        </div>
      </div>
    </div>
  )
}
