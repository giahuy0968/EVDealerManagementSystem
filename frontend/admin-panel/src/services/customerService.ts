import { api } from '../lib/api'
import type {
  CustomerCreateDTO,
  CustomerResponseDTO,
  CustomerSearchResultDTO,
  TestDriveCreateDTO,
  TestDriveResponseDTO,
  FeedbackCreateDTO,
  FeedbackResponseDTO
} from '../types'

export const customerService = {
  // Tạo khách hàng
  create: async (data: CustomerCreateDTO): Promise<CustomerResponseDTO> => {
    const response = await api.post('/api/v1/customers', data)
    return response.data
  },

  // Tìm kiếm khách hàng
  search: async (query: string): Promise<CustomerSearchResultDTO[]> => {
    const response = await api.get('/api/v1/customers/search', {
      params: { q: query }
    })
    return response.data
  },

  // Lấy danh sách khách hàng
  getAll: async (): Promise<CustomerResponseDTO[]> => {
    const response = await api.get('/api/v1/customers')
    return response.data
  },

  // Lấy chi tiết khách hàng
  getById: async (id: string): Promise<CustomerResponseDTO> => {
    const response = await api.get(`/api/v1/customers/${id}`)
    return response.data
  },

  // Cập nhật khách hàng
  update: async (id: string, data: Partial<CustomerCreateDTO>): Promise<CustomerResponseDTO> => {
    const response = await api.put(`/api/v1/customers/${id}`, data)
    return response.data
  },

  // Xóa khách hàng
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/customers/${id}`)
  },

  // ==================== TEST DRIVES ====================
  
  // Tạo lịch hẹn test drive
  createTestDrive: async (data: TestDriveCreateDTO): Promise<TestDriveResponseDTO> => {
    const response = await api.post('/api/v1/test-drives', data)
    return response.data
  },

  // Lấy danh sách test drives
  getTestDrives: async (): Promise<TestDriveResponseDTO[]> => {
    const response = await api.get('/api/v1/test-drives')
    return response.data
  },

  // Cập nhật trạng thái test drive
  updateTestDrive: async (id: string, status: string): Promise<TestDriveResponseDTO> => {
    const response = await api.put(`/api/v1/test-drives/${id}`, { status })
    return response.data
  },

  // ==================== FEEDBACKS ====================
  
  // Tạo feedback
  createFeedback: async (data: FeedbackCreateDTO): Promise<FeedbackResponseDTO> => {
    const response = await api.post('/api/v1/feedbacks', data)
    return response.data
  },

  // Lấy danh sách feedbacks
  getFeedbacks: async (): Promise<FeedbackResponseDTO[]> => {
    const response = await api.get('/api/v1/feedbacks')
    return response.data
  }
}
