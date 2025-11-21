import { useEffect, useState } from 'react'
import customerService from '../../shared/services/customerService'

export default function DealerStaffDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    newLeads: 0,
    upcomingTestDrives: 0,
    pendingFeedbacks: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [customers, leads, testDrives, feedbacks] = await Promise.all([
        customerService.getCustomers().catch(() => ({ data: [] })),
        customerService.getLeads().catch(() => ({ data: [] })),
        customerService.getTestDrives().catch(() => ({ data: [] })),
        customerService.getFeedbacks({ isResolved: false }).catch(() => ({ data: [] })),
      ])

      setStats({
        totalCustomers: customers.data?.length || 0,
        newLeads: leads.data?.filter((l: any) => l.status === 'NEW').length || 0,
        upcomingTestDrives: testDrives.data?.filter((t: any) => t.status === 'SCHEDULED' || t.status === 'CONFIRMED').length || 0,
        pendingFeedbacks: feedbacks.data?.length || 0,
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
        📊 Tổng quan công việc
      </h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Tổng khách hàng</div>
          <div className="stat-value">{stats.totalCustomers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Leads mới</div>
          <div className="stat-value" style={{ color: '#3b82f6' }}>{stats.newLeads}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Lịch lái thử sắp tới</div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.upcomingTestDrives}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Phản hồi chưa xử lý</div>
          <div className="stat-value" style={{ color: '#ef4444' }}>{stats.pendingFeedbacks}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Công việc hôm nay</h3>
        </div>
        <div className="alert alert-info">
          <strong>💡 Gợi ý:</strong> Bạn có {stats.newLeads} leads mới cần liên hệ và {stats.upcomingTestDrives} lịch lái thử trong tuần này.
        </div>
      </div>
    </div>
  )
}
