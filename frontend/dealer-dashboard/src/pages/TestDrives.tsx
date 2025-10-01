import { useState, useEffect } from 'react'
import { customerService } from '../services/customerService'
import type { TestDriveResponseDTO } from '../types'

export default function TestDrives() {
  const [testDrives, setTestDrives] = useState<TestDriveResponseDTO[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTestDrives()
  }, [])

  const loadTestDrives = async () => {
    try {
      const data = await customerService.getTestDrives()
      setTestDrives(data)
    } catch (error) {
      console.error('Failed to load test drives:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      SCHEDULED: '#3b82f6',
      COMPLETED: '#10b981',
      CANCELLED: '#ef4444'
    }
    return {
      background: colors[status] + '20',
      color: colors[status],
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: 600
    }
  }

  if (loading) {
    return <div className="card"><p>Loading test drives...</p></div>
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Test Drive Schedule</h1>
        <div className="header-actions">
          <button className="btn btn-secondary">📅 Calendar View</button>
          <button className="btn btn-primary">+ Schedule Test Drive</button>
        </div>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-label">Today's Appointments</div>
          <div className="stat-value">{testDrives.filter(td => td.status === 'SCHEDULED').length}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-label">Completed This Week</div>
          <div className="stat-value">{testDrives.filter(td => td.status === 'COMPLETED').length}</div>
        </div>
        <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
          <div className="stat-label">Cancellations</div>
          <div className="stat-value">{testDrives.filter(td => td.status === 'CANCELLED').length}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Upcoming Test Drives</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Vehicle Model</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testDrives.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#a0aec0' }}>
                    No test drives scheduled.
                  </td>
                </tr>
              ) : (
                testDrives.map(td => (
                  <tr key={td.id}>
                    <td><strong>{td.customerName}</strong></td>
                    <td>{td.carModelName}</td>
                    <td>{new Date(td.scheduledDate).toLocaleDateString()}</td>
                    <td>{td.scheduledTime}</td>
                    <td><span style={getStatusBadge(td.status)}>{td.status}</span></td>
                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {td.note || '-'}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-secondary">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
