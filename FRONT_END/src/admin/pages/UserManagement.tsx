import { useEffect, useState } from 'react'
import authService, { User, RegisterData } from '../../shared/services/authService'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<Partial<RegisterData>>({
    username: '',
    email: '',
    password: '',
    fullName: '',
    role: 'DEALER_STAFF',
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await authService.getUsers()
      // Backend returns array directly, not wrapped in { data: [...] }
      const usersData = Array.isArray(response) ? response : (response.data || [])
      // Map backend fields to frontend User interface
      const mappedUsers = usersData.map((u: any) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        dealerId: u.dealerId,
        isActive: u.active, // Backend uses 'active', frontend uses 'isActive'
        createdAt: u.createdAt
      }))
      setUsers(mappedUsers)
    } catch (error) {
      console.error('Load users error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingUser(null)
    setFormData({
      username: '',
      email: '',
      password: '',
      fullName: '',
      role: 'DEALER_STAFF',
    })
    setShowModal(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      password: '', // Don't pre-fill password
    })
    setShowModal(true)
  }

  const handleViewDetail = (user: User) => {
    setSelectedUser(user)
    setShowDetailModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingUser) {
        await authService.updateUser(editingUser.id, formData)
        alert('Cập nhật người dùng thành công!')
      } else {
        await authService.register(formData as RegisterData)
        alert('Tạo người dùng mới thành công!')
      }
      setShowModal(false)
      loadUsers()
    } catch (error: any) {
      console.error('Submit error:', error)
      const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra!'
      alert(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (user: User) => {
    if (confirm(`Bạn có chắc muốn ${user.isActive ? 'vô hiệu hóa' : 'kích hoạt'} người dùng này?`)) {
      setLoading(true)
      try {
        // Backend expects { isActive: boolean }
        await authService.changeUserStatus(user.id, !user.isActive)
        alert('Thay đổi trạng thái thành công!')
        loadUsers()
      } catch (error: any) {
        console.error('Toggle status error:', error)
        const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi thay đổi trạng thái!'
        alert(errorMsg)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDelete = async (user: User) => {
    if (confirm(`Bạn có chắc muốn xóa vĩnh viễn người dùng "${user.fullName}"?\n\nThao tác này KHÔNG THỂ hoàn tác!`)) {
      setLoading(true)
      try {
        await authService.deleteUser(user.id)
        alert('Xóa người dùng thành công!')
        loadUsers()
      } catch (error: any) {
        console.error('Delete error:', error)
        const errorMsg = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi xóa người dùng!'
        alert(errorMsg)
      } finally {
        setLoading(false)
      }
    }
  }

  const getRoleName = (role: string) => {
    const roleMap: Record<string, string> = {
      'ADMIN': 'Quản trị viên',
      'DEALER_MANAGER': 'Quản lý đại lý',
      'DEALER_STAFF': 'Nhân viên đại lý',
      'EVM_STAFF': 'Nhân viên hãng',
    }
    return roleMap[role] || role
  }

  if (loading && users.length === 0) {
    return <div className="loading-spinner"></div>
  }

  return (
    <div>
      <div className="flex-between mb-4">
        <h2 style={{ fontSize: '24px', fontWeight: '700' }}>
          👥 Quản lý người dùng
        </h2>
        <button onClick={handleCreate} className="btn btn-primary">
          ➕ Thêm người dùng
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Tên đăng nhập</th>
                <th style={{ width: '20%' }}>Họ tên</th>
                <th style={{ width: '15%' }}>Vai trò</th>
                <th style={{ width: '12%' }}>Trạng thái</th>
                <th style={{ width: '28%' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
                    Chưa có người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td><strong>{user.username}</strong></td>
                    <td>{user.fullName}</td>
                    <td><span className="badge badge-info">{getRoleName(user.role)}</span></td>
                    <td>
                      <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                        {user.isActive ? '✓ Hoạt động' : '✗ Vô hiệu hóa'}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewDetail(user)} 
                          className="btn btn-sm btn-secondary"
                          title="Xem chi tiết"
                        >
                          👁️ Chi tiết
                        </button>
                        <button 
                          onClick={() => handleEdit(user)} 
                          className="btn btn-sm btn-secondary"
                          title="Chỉnh sửa"
                        >
                          ✏️ Sửa
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`btn btn-sm ${user.isActive ? 'btn-danger' : 'btn-success'}`}
                          title={user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        >
                          {user.isActive ? '🚫' : '✅'}
                        </button>
                        <button 
                          onClick={() => handleDelete(user)} 
                          className="btn btn-sm btn-danger"
                          title="Xóa người dùng"
                        >
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
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingUser ? 'Cập nhật người dùng' : 'Thêm người dùng mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="close-btn">×</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tên đăng nhập *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  disabled={!!editingUser}
                />
              </div>

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
                <label className="form-label">Vai trò *</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="DEALER_STAFF">Nhân viên đại lý</option>
                  <option value="DEALER_MANAGER">Quản lý đại lý</option>
                  <option value="EVM_STAFF">Nhân viên hãng</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label className="form-label">Mật khẩu *</label>
                  <input
                    type="password"
                    className="form-input"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                    placeholder="Tối thiểu 8 ký tự"
                  />
                </div>
              )}

              <div className="flex gap-2" style={{ marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Đang xử lý...' : (editingUser ? 'Cập nhật' : 'Tạo mới')}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">👤 Thông tin chi tiết người dùng</h3>
              <button onClick={() => setShowDetailModal(false)} className="close-btn">×</button>
            </div>

            <div style={{ padding: '24px' }}>
              <div className="detail-grid">
                <div className="detail-row">
                  <span className="detail-label">Tên đăng nhập:</span>
                  <span className="detail-value"><strong>{selectedUser.username}</strong></span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Họ tên:</span>
                  <span className="detail-value">{selectedUser.fullName}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{selectedUser.email}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Vai trò:</span>
                  <span className="detail-value">
                    <span className="badge badge-info">{getRoleName(selectedUser.role)}</span>
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Trạng thái:</span>
                  <span className="detail-value">
                    <span className={`badge ${selectedUser.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {selectedUser.isActive ? '✓ Hoạt động' : '✗ Vô hiệu hóa'}
                    </span>
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Ngày tạo:</span>
                  <span className="detail-value">
                    {new Date(selectedUser.createdAt).toLocaleString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">ID:</span>
                  <span className="detail-value" style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6b7280' }}>
                    {selectedUser.id}
                  </span>
                </div>

                {selectedUser.dealerId && (
                  <div className="detail-row">
                    <span className="detail-label">Dealer ID:</span>
                    <span className="detail-value" style={{ fontSize: '12px', fontFamily: 'monospace', color: '#6b7280' }}>
                      {selectedUser.dealerId}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2" style={{ marginTop: '24px', justifyContent: 'flex-end' }}>
                <button onClick={() => { setShowDetailModal(false); handleEdit(selectedUser) }} className="btn btn-primary">
                  ✏️ Chỉnh sửa
                </button>
                <button onClick={() => setShowDetailModal(false)} className="btn btn-secondary">
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
