import { useEffect, useState } from 'react'
import customerService, { Lead } from '../../shared/services/customerService'

export default function LeadManagement() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [filterStatus, setFilterStatus] = useState('')
  
  const [formData, setFormData] = useState<Partial<Lead>>({
    name: '',
    phone: '',
    email: '',
    interestedModels: [],
    source: '',
    status: 'NEW',
    notes: '',
  })

  useEffect(() => {
    loadLeads()
  }, [filterStatus])

  const loadLeads = async () => {
    try {
      const response = await customerService.getLeads({ status: filterStatus || undefined })
      setLeads(response.data || [])
    } catch (error) {
      console.error('Load leads error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingLead(null)
    setFormData({
      name: '',
      phone: '',
      email: '',
      interestedModels: [],
      source: '',
      status: 'NEW',
      notes: '',
    })
    setShowModal(true)
  }

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead)
    setFormData(lead)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingLead) {
        await customerService.updateLead(editingLead.id, formData)
        alert('Cập nhật lead thành công!')
      } else {
        await customerService.createLead(formData)
        alert('Tạo lead mới thành công!')
      }
      setShowModal(false)
      loadLeads()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  const handleConvert = async (lead: Lead) => {
    if (confirm(`Chuyển đổi lead "${lead.name}" thành khách hàng?`)) {
      try {
        await customerService.convertLead(lead.id, {
          fullName: lead.name,
          phone: lead.phone,
          email: lead.email,
        })
        alert('Chuyển đổi thành công!')
        loadLeads()
      } catch (error: any) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra!')
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'NEW': { label: 'Mới', className: 'badge-info' },
      'CONTACTED': { label: 'Đã liên hệ', className: 'badge-warning' },
      'QUALIFIED': { label: 'Đủ điều kiện', className: 'badge-success' },
      'LOST': { label: 'Mất', className: 'badge-danger' },
      'CONVERTED': { label: 'Đã chuyển đổi', className: 'badge-success' },
    }
    const statusInfo = statusMap[status] || { label: status, className: 'badge-info' }
    return <span className={`badge ${statusInfo.className}`}>{statusInfo.label}</span>
  }

  if (loading && leads.length === 0) {
    return <div className="loading-spinner"></div>
  }

  return (
    <div>
      <div className="flex-between mb-4">
        <h2 style={{ fontSize: '24px', fontWeight: '700' }}>
          🎯 Quản lý Leads
        </h2>
        <button onClick={handleCreate} className="btn btn-primary">
          ➕ Thêm lead
        </button>
      </div>

      <div className="card mb-4">
        <select
          className="form-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="NEW">Mới</option>
          <option value="CONTACTED">Đã liên hệ</option>
          <option value="QUALIFIED">Đủ điều kiện</option>
          <option value="LOST">Mất</option>
          <option value="CONVERTED">Đã chuyển đổi</option>
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Nguồn</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    Chưa có lead nào
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td><strong>{lead.name}</strong></td>
                    <td>{lead.phone}</td>
                    <td>{lead.email}</td>
                    <td>{lead.source}</td>
                    <td>{getStatusBadge(lead.status)}</td>
                    <td>{new Date(lead.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(lead)} className="btn btn-sm btn-secondary">
                          ✏️
                        </button>
                        {lead.status !== 'CONVERTED' && (
                          <button onClick={() => handleConvert(lead)} className="btn btn-sm btn-success">
                            ✅ Chuyển đổi
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingLead ? 'Cập nhật lead' : 'Thêm lead mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="close-btn">×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tên *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Số điện thoại *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nguồn</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="VD: Website, Facebook, Giới thiệu..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ghi chú</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-2" style={{ marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Đang xử lý...' : (editingLead ? 'Cập nhật' : 'Tạo mới')}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
