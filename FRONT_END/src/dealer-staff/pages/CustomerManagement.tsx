import { useEffect, useState } from 'react'
import customerService, { Customer } from '../../shared/services/customerService'

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  
  const [formData, setFormData] = useState<Partial<Customer>>({
    fullName: '',
    phone: '',
    email: '',
    identityNumber: '',
    dateOfBirth: '',
    gender: 'MALE',
    address: '',
    city: '',
    district: '',
    ward: '',
    customerType: 'INDIVIDUAL',
    source: 'WALK_IN',
    status: 'NEW',
    tags: [],
  })

  useEffect(() => {
    loadCustomers()
  }, [filterStatus])

  const loadCustomers = async () => {
    try {
      const response = await customerService.getCustomers({ status: filterStatus || undefined })
      setCustomers(response.data || [])
    } catch (error) {
      console.error('Load customers error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingCustomer(null)
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      identityNumber: '',
      dateOfBirth: '',
      gender: 'MALE',
      address: '',
      city: '',
      district: '',
      ward: '',
      customerType: 'INDIVIDUAL',
      source: 'WALK_IN',
      status: 'NEW',
      tags: [],
    })
    setShowModal(true)
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData(customer)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingCustomer) {
        await customerService.updateCustomer(editingCustomer.id, formData)
        alert('Cập nhật khách hàng thành công!')
      } else {
        await customerService.createCustomer(formData)
        alert('Tạo khách hàng mới thành công!')
      }
      setShowModal(false)
      loadCustomers()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra!')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (customer: Customer) => {
    if (confirm(`Bạn có chắc muốn xóa khách hàng "${customer.fullName}"?`)) {
      try {
        await customerService.deleteCustomer(customer.id)
        alert('Xóa khách hàng thành công!')
        loadCustomers()
      } catch (error: any) {
        alert(error.response?.data?.message || 'Có lỗi xảy ra!')
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      'NEW': { label: 'Mới', className: 'badge-info' },
      'CONTACTED': { label: 'Đã liên hệ', className: 'badge-warning' },
      'NEGOTIATING': { label: 'Đang đàm phán', className: 'badge-warning' },
      'CONVERTED': { label: 'Đã chuyển đổi', className: 'badge-success' },
      'INACTIVE': { label: 'Không hoạt động', className: 'badge-danger' },
    }
    const statusInfo = statusMap[status] || { label: status, className: 'badge-info' }
    return <span className={`badge ${statusInfo.className}`}>{statusInfo.label}</span>
  }

  const filteredCustomers = customers.filter(customer =>
    customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading && customers.length === 0) {
    return <div className="loading-spinner"></div>
  }

  return (
    <div>
      <div className="flex-between mb-4">
        <h2 style={{ fontSize: '24px', fontWeight: '700' }}>
          🧑‍💼 Quản lý khách hàng
        </h2>
        <button onClick={handleCreate} className="btn btn-primary">
          ➕ Thêm khách hàng
        </button>
      </div>

      <div className="card mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên, SĐT, email..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="NEW">Mới</option>
            <option value="CONTACTED">Đã liên hệ</option>
            <option value="NEGOTIATING">Đang đàm phán</option>
            <option value="CONVERTED">Đã chuyển đổi</option>
            <option value="INACTIVE">Không hoạt động</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Nguồn</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                    Chưa có khách hàng nào
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td><strong>{customer.fullName}</strong></td>
                    <td>{customer.phone}</td>
                    <td>{customer.email}</td>
                    <td>{customer.source}</td>
                    <td>{getStatusBadge(customer.status)}</td>
                    <td>{new Date(customer.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(customer)} className="btn btn-sm btn-secondary">
                          ✏️ Sửa
                        </button>
                        <button onClick={() => handleDelete(customer)} className="btn btn-sm btn-danger">
                          🗑️
                        </button>
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
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingCustomer ? 'Cập nhật khách hàng' : 'Thêm khách hàng mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="close-btn">×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Họ tên *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
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
                    placeholder="0123456789"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CCCD/Passport</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.identityNumber}
                    onChange={(e) => setFormData({ ...formData, identityNumber: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ngày sinh</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Giới tính</label>
                  <select
                    className="form-select"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Nguồn khách hàng</label>
                  <select
                    className="form-select"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                  >
                    <option value="WALK_IN">Khách vãng lai</option>
                    <option value="PHONE">Điện thoại</option>
                    <option value="WEBSITE">Website</option>
                    <option value="REFERRAL">Giới thiệu</option>
                    <option value="EVENT">Sự kiện</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Trạng thái</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  >
                    <option value="NEW">Mới</option>
                    <option value="CONTACTED">Đã liên hệ</option>
                    <option value="NEGOTIATING">Đang đàm phán</option>
                    <option value="CONVERTED">Đã chuyển đổi</option>
                    <option value="INACTIVE">Không hoạt động</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Địa chỉ</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="flex gap-2" style={{ marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Đang xử lý...' : (editingCustomer ? 'Cập nhật' : 'Tạo mới')}
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
