import { api } from '../lib/api'
import type {
  SalesReportDTO,
  InventoryReportDTO,
  DebtReportDTO,
  DashboardDTO
} from '../types'

export const reportService = {
  // Báo cáo doanh số
  getSalesReport: async (params: {
    dealerId?: string
    staffId?: string
    fromDate: string
    toDate: string
  }): Promise<SalesReportDTO> => {
    const response = await api.get('/api/v1/reports/sales', { params })
    return response.data
  },

  // Báo cáo tồn kho
  getInventoryReport: async (params: {
    dealerId?: string
    modelId?: string
  }): Promise<InventoryReportDTO> => {
    const response = await api.get('/api/v1/reports/inventory', { params })
    return response.data
  },

  // Báo cáo công nợ
  getDebtReport: async (params: {
    dealerId?: string
    customerId?: string
  }): Promise<DebtReportDTO> => {
    const response = await api.get('/api/v1/reports/debt', { params })
    return response.data
  },

  // Dashboard data
  getDashboard: async (params: {
    type: 'DEALER' | 'MANUFACTURER' | 'ADMIN'
    scope: string
  }): Promise<DashboardDTO> => {
    const response = await api.get('/api/v1/dashboard', { params })
    return response.data
  },

  // Export báo cáo
  exportReport: async (type: string, params: any): Promise<Blob> => {
    const response = await api.get(`/api/v1/reports/${type}/export`, {
      params,
      responseType: 'blob'
    })
    return response.data
  }
}
