import { api } from '../lib/api'
import type {
  ProductCreateDTO,
  ProductResponseDTO,
  InventoryUpdateDTO,
  InventoryResponseDTO,
  AllocationCreateDTO,
  AllocationResponseDTO,
  DealerCreateDTO,
  DealerResponseDTO,
  PricingPolicyCreateDTO,
  PricingPolicyResponseDTO
} from '../types'

export const manufacturerService = {
  // ==================== PRODUCTS ====================
  
  // Quản lý mẫu xe
  getProducts: async (): Promise<ProductResponseDTO[]> => {
    const response = await api.get('/api/v1/products')
    return response.data
  },

  createProduct: async (data: ProductCreateDTO): Promise<ProductResponseDTO> => {
    const response = await api.post('/api/v1/products', data)
    return response.data
  },

  updateProduct: async (id: string, data: Partial<ProductCreateDTO>): Promise<ProductResponseDTO> => {
    const response = await api.put(`/api/v1/products/${id}`, data)
    return response.data
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/products/${id}`)
  },

  getProductById: async (id: string): Promise<ProductResponseDTO> => {
    const response = await api.get(`/api/v1/products/${id}`)
    return response.data
  },

  // ==================== INVENTORY ====================
  
  // Quản lý tồn kho
  getInventory: async (): Promise<InventoryResponseDTO[]> => {
    const response = await api.get('/api/v1/inventory')
    return response.data
  },

  updateInventory: async (data: InventoryUpdateDTO): Promise<InventoryResponseDTO> => {
    const response = await api.put('/api/v1/inventory', data)
    return response.data
  },

  getInventoryByProduct: async (productId: string): Promise<InventoryResponseDTO> => {
    const response = await api.get(`/api/v1/inventory/${productId}`)
    return response.data
  },

  // ==================== ALLOCATIONS ====================
  
  // Phân bổ xe
  createAllocation: async (data: AllocationCreateDTO): Promise<AllocationResponseDTO> => {
    const response = await api.post('/api/v1/allocations', data)
    return response.data
  },

  getAllocations: async (): Promise<AllocationResponseDTO[]> => {
    const response = await api.get('/api/v1/allocations')
    return response.data
  },

  getAllocationById: async (id: string): Promise<AllocationResponseDTO> => {
    const response = await api.get(`/api/v1/allocations/${id}`)
    return response.data
  },

  updateAllocationStatus: async (id: string, status: string): Promise<AllocationResponseDTO> => {
    const response = await api.put(`/api/v1/allocations/${id}/status`, { status })
    return response.data
  },

  // ==================== DEALERS ====================
  
  // Quản lý đại lý
  getDealers: async (): Promise<DealerResponseDTO[]> => {
    const response = await api.get('/api/v1/dealers')
    return response.data
  },

  createDealer: async (data: DealerCreateDTO): Promise<DealerResponseDTO> => {
    const response = await api.post('/api/v1/dealers', data)
    return response.data
  },

  updateDealer: async (id: string, data: Partial<DealerCreateDTO>): Promise<DealerResponseDTO> => {
    const response = await api.put(`/api/v1/dealers/${id}`, data)
    return response.data
  },

  deleteDealer: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/dealers/${id}`)
  },

  getDealerById: async (id: string): Promise<DealerResponseDTO> => {
    const response = await api.get(`/api/v1/dealers/${id}`)
    return response.data
  },

  // ==================== PRICING POLICIES ====================
  
  // Chính sách giá
  getPricingPolicies: async (): Promise<PricingPolicyResponseDTO[]> => {
    const response = await api.get('/api/v1/pricing-policies')
    return response.data
  },

  createPricingPolicy: async (data: PricingPolicyCreateDTO): Promise<PricingPolicyResponseDTO> => {
    const response = await api.post('/api/v1/pricing-policies', data)
    return response.data
  },

  updatePricingPolicy: async (id: string, data: Partial<PricingPolicyCreateDTO>): Promise<PricingPolicyResponseDTO> => {
    const response = await api.put(`/api/v1/pricing-policies/${id}`, data)
    return response.data
  },

  deletePricingPolicy: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/pricing-policies/${id}`)
  }
}
