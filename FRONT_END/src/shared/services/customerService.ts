import apiClient from './api'

export interface Customer {
  id: string
  dealerId: string
  assignedStaffId?: string
  fullName: string
  phone: string
  email: string
  identityNumber: string
  dateOfBirth: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  address: string
  city: string
  district: string
  ward: string
  customerType: 'INDIVIDUAL' | 'BUSINESS'
  taxCode?: string
  source: 'WALK_IN' | 'PHONE' | 'WEBSITE' | 'REFERRAL' | 'EVENT'
  status: 'NEW' | 'CONTACTED' | 'NEGOTIATING' | 'CONVERTED' | 'INACTIVE'
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Lead {
  id: string
  dealerId: string
  assignedStaffId?: string
  name: string
  phone: string
  email: string
  interestedModels: string[]
  source: string
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST' | 'CONVERTED'
  notes: string
  createdAt: string
  convertedAt?: string
  customerId?: string
}

export interface TestDrive {
  id: string
  customerId: string
  dealerId: string
  carModelId: string
  scheduledDate: string
  scheduledTime: string
  staffId: string
  status: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  notes: string
  feedback?: string
  rating?: number
  createdAt: string
  updatedAt: string
}

export interface Feedback {
  id: string
  customerId: string
  dealerId: string
  orderId?: string
  type: 'SERVICE' | 'PRODUCT' | 'STAFF' | 'FACILITY'
  rating: number
  content: string
  isResolved: boolean
  resolvedBy?: string
  resolvedAt?: string
  response?: string
  createdAt: string
}

export interface Complaint {
  id: string
  customerId: string
  dealerId: string
  subject: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  assignedTo?: string
  resolution?: string
  createdAt: string
  resolvedAt?: string
}

const customerService = {
  // Customer Management
  getCustomers: async (params?: {
    page?: number
    limit?: number
    status?: string
    search?: string
  }) => {
    const response = await apiClient.get('/customers', { params })
    return response.data
  },

  getCustomerById: async (id: string) => {
    const response = await apiClient.get(`/customers/${id}`)
    return response.data
  },

  createCustomer: async (data: Partial<Customer>) => {
    const response = await apiClient.post('/customers', data)
    return response.data
  },

  updateCustomer: async (id: string, data: Partial<Customer>) => {
    const response = await apiClient.put(`/customers/${id}`, data)
    return response.data
  },

  deleteCustomer: async (id: string) => {
    const response = await apiClient.delete(`/customers/${id}`)
    return response.data
  },

  searchCustomers: async (query: string) => {
    const response = await apiClient.get('/customers/search', {
      params: { q: query },
    })
    return response.data
  },

  getCustomerHistory: async (id: string) => {
    const response = await apiClient.get(`/customers/${id}/history`)
    return response.data
  },

  addCustomerNote: async (id: string, note: string) => {
    const response = await apiClient.post(`/customers/${id}/notes`, { note })
    return response.data
  },

  getCustomerOrders: async (id: string) => {
    const response = await apiClient.get(`/customers/${id}/orders`)
    return response.data
  },

  // Lead Management
  getLeads: async (params?: {
    page?: number
    limit?: number
    status?: string
  }) => {
    const response = await apiClient.get('/leads', { params })
    return response.data
  },

  getLeadById: async (id: string) => {
    const response = await apiClient.get(`/leads/${id}`)
    return response.data
  },

  createLead: async (data: Partial<Lead>) => {
    const response = await apiClient.post('/leads', data)
    return response.data
  },

  updateLead: async (id: string, data: Partial<Lead>) => {
    const response = await apiClient.put(`/leads/${id}`, data)
    return response.data
  },

  updateLeadStatus: async (id: string, status: Lead['status']) => {
    const response = await apiClient.put(`/leads/${id}/status`, { status })
    return response.data
  },

  convertLead: async (id: string, customerData: Partial<Customer>) => {
    const response = await apiClient.post(`/leads/${id}/convert`, customerData)
    return response.data
  },

  assignLead: async (id: string, staffId: string) => {
    const response = await apiClient.put(`/leads/${id}/assign`, { staffId })
    return response.data
  },

  // Test Drive Management
  getTestDrives: async (params?: {
    page?: number
    limit?: number
    status?: string
    date?: string
  }) => {
    const response = await apiClient.get('/test-drives', { params })
    return response.data
  },

  getTestDriveById: async (id: string) => {
    const response = await apiClient.get(`/test-drives/${id}`)
    return response.data
  },

  createTestDrive: async (data: Partial<TestDrive>) => {
    const response = await apiClient.post('/test-drives', data)
    return response.data
  },

  updateTestDrive: async (id: string, data: Partial<TestDrive>) => {
    const response = await apiClient.put(`/test-drives/${id}`, data)
    return response.data
  },

  updateTestDriveStatus: async (id: string, status: TestDrive['status']) => {
    const response = await apiClient.put(`/test-drives/${id}/status`, { status })
    return response.data
  },

  addTestDriveFeedback: async (id: string, feedback: string, rating: number) => {
    const response = await apiClient.post(`/test-drives/${id}/feedback`, {
      feedback,
      rating,
    })
    return response.data
  },

  getTestDriveCalendar: async (startDate: string, endDate: string) => {
    const response = await apiClient.get('/test-drives/calendar', {
      params: { startDate, endDate },
    })
    return response.data
  },

  // Feedback Management
  getFeedbacks: async (params?: {
    page?: number
    limit?: number
    type?: string
    isResolved?: boolean
  }) => {
    const response = await apiClient.get('/feedbacks', { params })
    return response.data
  },

  getFeedbackById: async (id: string) => {
    const response = await apiClient.get(`/feedbacks/${id}`)
    return response.data
  },

  createFeedback: async (data: Partial<Feedback>) => {
    const response = await apiClient.post('/feedbacks', data)
    return response.data
  },

  resolveFeedback: async (id: string, response: string) => {
    const responseData = await apiClient.put(`/feedbacks/${id}/resolve`, {
      response,
    })
    return responseData.data
  },

  // Complaint Management
  getComplaints: async (params?: {
    page?: number
    limit?: number
    status?: string
    priority?: string
  }) => {
    const response = await apiClient.get('/complaints', { params })
    return response.data
  },

  getComplaintById: async (id: string) => {
    const response = await apiClient.get(`/complaints/${id}`)
    return response.data
  },

  createComplaint: async (data: Partial<Complaint>) => {
    const response = await apiClient.post('/complaints', data)
    return response.data
  },

  resolveComplaint: async (id: string, resolution: string) => {
    const response = await apiClient.put(`/complaints/${id}/resolve`, {
      resolution,
    })
    return response.data
  },

  // Customer Segmentation
  getCustomerSegments: async () => {
    const response = await apiClient.get('/customers/segments')
    return response.data
  },

  getCustomerScore: async (id: string) => {
    const response = await apiClient.get(`/customers/${id}/score`)
    return response.data
  },
}

export default customerService
