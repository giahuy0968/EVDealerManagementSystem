import { api } from '../lib/api'
import type {
  NotificationRequestDTO,
  NotificationResponseDTO,
  TemplateCreateDTO,
  TemplateResponseDTO
} from '../types'

export const notificationService = {
  // Gửi thông báo
  send: async (data: NotificationRequestDTO): Promise<void> => {
    await api.post('/api/v1/notifications/send', data)
  },

  // Lấy danh sách thông báo của user
  getMyNotifications: async (): Promise<NotificationResponseDTO[]> => {
    const response = await api.get('/api/v1/notifications/me')
    return response.data
  },

  // Đánh dấu đã đọc
  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/api/v1/notifications/${id}/read`)
  },

  // Đánh dấu tất cả đã đọc
  markAllAsRead: async (): Promise<void> => {
    await api.put('/api/v1/notifications/read-all')
  },

  // Xóa thông báo
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/notifications/${id}`)
  },

  // ==================== TEMPLATES (ADMIN) ====================
  
  // Quản lý template
  getTemplates: async (): Promise<TemplateResponseDTO[]> => {
    const response = await api.get('/api/v1/templates')
    return response.data
  },

  createTemplate: async (data: TemplateCreateDTO): Promise<TemplateResponseDTO> => {
    const response = await api.post('/api/v1/templates', data)
    return response.data
  },

  updateTemplate: async (id: string, data: Partial<TemplateCreateDTO>): Promise<TemplateResponseDTO> => {
    const response = await api.put(`/api/v1/templates/${id}`, data)
    return response.data
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/templates/${id}`)
  }
}
