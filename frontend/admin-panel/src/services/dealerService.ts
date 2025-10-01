import { api } from '../lib/api'
import type {
  CarResponseDTO,
  CarCompareRequestDTO,
  CarCompareResponseDTO,
  QuotationCreateDTO,
  QuotationResponseDTO,
  OrderCreateDTO,
  OrderResponseDTO,
  OrderTrackingDTO,
  StockRequestCreateDTO,
  StockRequestResponseDTO,
  ContractCreateDTO,
  ContractResponseDTO,
  PaymentCreateDTO,
  PaymentResponseDTO
} from '../types'

export const dealerService = {
  // ==================== VEHICLES / CARS ====================
  
  // Danh mục xe
  getCars: async (): Promise<CarResponseDTO[]> => {
    const response = await api.get('/api/v1/cars')
    return response.data
  },

  // Chi tiết xe
  getCarById: async (id: string): Promise<CarResponseDTO> => {
    const response = await api.get(`/api/v1/cars/${id}`)
    return response.data
  },

  // So sánh xe
  compareCars: async (data: CarCompareRequestDTO): Promise<CarCompareResponseDTO> => {
    const response = await api.post('/api/v1/cars/compare', data)
    return response.data
  },

  // ==================== QUOTATIONS ====================
  
  // Tạo báo giá
  createQuotation: async (data: QuotationCreateDTO): Promise<QuotationResponseDTO> => {
    const response = await api.post('/api/v1/quotations', data)
    return response.data
  },

  // Lấy danh sách báo giá
  getQuotations: async (): Promise<QuotationResponseDTO[]> => {
    const response = await api.get('/api/v1/quotations')
    return response.data
  },

  // Chi tiết báo giá
  getQuotationById: async (id: string): Promise<QuotationResponseDTO> => {
    const response = await api.get(`/api/v1/quotations/${id}`)
    return response.data
  },

  // Cập nhật báo giá
  updateQuotation: async (id: string, data: Partial<QuotationCreateDTO>): Promise<QuotationResponseDTO> => {
    const response = await api.put(`/api/v1/quotations/${id}`, data)
    return response.data
  },

  // ==================== ORDERS ====================
  
  // Tạo đơn hàng
  createOrder: async (data: OrderCreateDTO): Promise<OrderResponseDTO> => {
    const response = await api.post('/api/v1/orders', data)
    return response.data
  },

  // Lấy danh sách đơn hàng
  getOrders: async (): Promise<OrderResponseDTO[]> => {
    const response = await api.get('/api/v1/orders')
    return response.data
  },

  // Chi tiết đơn hàng
  getOrderById: async (id: string): Promise<OrderResponseDTO> => {
    const response = await api.get(`/api/v1/orders/${id}`)
    return response.data
  },

  // Theo dõi đơn hàng
  trackOrder: async (id: string): Promise<OrderTrackingDTO> => {
    const response = await api.get(`/api/v1/orders/${id}/tracking`)
    return response.data
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (id: string, status: string): Promise<OrderResponseDTO> => {
    const response = await api.put(`/api/v1/orders/${id}/status`, { status })
    return response.data
  },

  // ==================== STOCK REQUESTS ====================
  
  // Đặt xe từ hãng
  createStockRequest: async (data: StockRequestCreateDTO): Promise<StockRequestResponseDTO> => {
    const response = await api.post('/api/v1/stock-requests', data)
    return response.data
  },

  // Lấy danh sách yêu cầu đặt hàng
  getStockRequests: async (): Promise<StockRequestResponseDTO[]> => {
    const response = await api.get('/api/v1/stock-requests')
    return response.data
  },

  // Chi tiết yêu cầu
  getStockRequestById: async (id: string): Promise<StockRequestResponseDTO> => {
    const response = await api.get(`/api/v1/stock-requests/${id}`)
    return response.data
  },

  // ==================== CONTRACTS ====================
  
  // Tạo hợp đồng
  createContract: async (data: ContractCreateDTO): Promise<ContractResponseDTO> => {
    const response = await api.post('/api/v1/contracts', data)
    return response.data
  },

  // Lấy danh sách hợp đồng
  getContracts: async (): Promise<ContractResponseDTO[]> => {
    const response = await api.get('/api/v1/contracts')
    return response.data
  },

  // Chi tiết hợp đồng
  getContractById: async (id: string): Promise<ContractResponseDTO> => {
    const response = await api.get(`/api/v1/contracts/${id}`)
    return response.data
  },

  // ==================== PAYMENTS ====================
  
  // Tạo thanh toán
  createPayment: async (data: PaymentCreateDTO): Promise<PaymentResponseDTO> => {
    const response = await api.post('/api/v1/payments', data)
    return response.data
  },

  // Lấy danh sách thanh toán
  getPayments: async (): Promise<PaymentResponseDTO[]> => {
    const response = await api.get('/api/v1/payments')
    return response.data
  },

  // Chi tiết thanh toán
  getPaymentById: async (id: string): Promise<PaymentResponseDTO> => {
    const response = await api.get(`/api/v1/payments/${id}`)
    return response.data
  }
}
