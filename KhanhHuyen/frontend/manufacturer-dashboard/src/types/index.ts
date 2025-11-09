// ==================== USER & AUTH ====================
export type UserRole = 'DEALER_STAFF' | 'DEALER_MANAGER' | 'EVM_STAFF' | 'ADMIN'

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  dealerId?: string
  createdAt: string
}

export interface UserCreateDTO {
  username: string
  password: string
  email: string
  role: UserRole
  dealerId?: string
}

export interface UserResponseDTO {
  id: string
  username: string
  email: string
  role: UserRole
  dealerId?: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequestDTO {
  username?: string
  email?: string
  password: string
}

export interface LoginResponseDTO {
  token: string
  refreshToken: string
  userInfo: User
}

// ==================== CUSTOMER ====================
export interface CustomerCreateDTO {
  fullName: string
  phone: string
  email: string
  identityNumber: string
  address: string
}

export interface CustomerResponseDTO {
  id: string
  fullName: string
  phone: string
  email: string
  identityNumber: string
  address: string
  dealerId: string
  assignedStaffId?: string
  createdAt: string
  updatedAt: string
}

export interface CustomerSearchResultDTO {
  id: string
  fullName: string
  phone: string
  email: string
  totalOrders: number
  lastContactDate: string
}

// ==================== TEST DRIVE ====================
export interface TestDriveCreateDTO {
  customerId: string
  carModelId: string
  scheduledDate: string
  scheduledTime: string
  note?: string
}

export interface TestDriveResponseDTO {
  id: string
  customerId: string
  customerName: string
  carModelId: string
  carModelName: string
  scheduledDate: string
  scheduledTime: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  note?: string
  createdAt: string
}

// ==================== FEEDBACK ====================
export interface FeedbackCreateDTO {
  customerId: string
  rating: number
  comment: string
  category: 'PRODUCT' | 'SERVICE' | 'DELIVERY' | 'OTHER'
}

export interface FeedbackResponseDTO {
  id: string
  customerId: string
  customerName: string
  rating: number
  comment: string
  category: string
  createdAt: string
}

// ==================== CAR / VEHICLE ====================
export interface CarResponseDTO {
  id: string
  name: string
  model: string
  version: string
  year: number
  basePrice: number
  colors: string[]
  specifications: {
    batteryCapacity: string
    range: string
    maxSpeed: string
    acceleration: string
    chargingTime: string
    seats: number
    transmission: string
  }
  images: string[]
  stock: number
  dealerId?: string
}

export interface CarCompareRequestDTO {
  carIds: string[]
}

export interface CarCompareResponseDTO {
  cars: CarResponseDTO[]
  comparisonMatrix: {
    [key: string]: any
  }
}

// ==================== QUOTATION ====================
export interface QuotationCreateDTO {
  customerId: string
  carModelId: string
  promotions?: string[]
  validUntil: string
  note?: string
}

export interface QuotationResponseDTO {
  id: string
  customerId: string
  customerName: string
  carModelId: string
  carModelName: string
  basePrice: number
  promotions: Array<{
    name: string
    discount: number
  }>
  finalPrice: number
  validUntil: string
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'EXPIRED'
  createdAt: string
}

// ==================== ORDER ====================
export interface OrderCreateDTO {
  customerId: string
  items: Array<{
    carModelId: string
    quantity: number
  }>
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'INSTALLMENT'
  note?: string
}

export interface OrderResponseDTO {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  items: Array<{
    carModelId: string
    carModelName: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }>
  totalAmount: number
  paymentMethod: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'DELIVERING' | 'COMPLETED' | 'CANCELLED'
  note?: string
  createdAt: string
  updatedAt: string
}

export interface OrderTrackingDTO {
  orderId: string
  orderNumber: string
  currentStatus: string
  timeline: Array<{
    status: string
    description: string
    timestamp: string
    performer?: string
  }>
  estimatedDeliveryDate?: string
}

// ==================== STOCK REQUEST ====================
export interface StockRequestCreateDTO {
  dealerId: string
  carModelId: string
  quantity: number
  urgency: 'LOW' | 'MEDIUM' | 'HIGH'
  expectedDate: string
  reason?: string
}

export interface StockRequestResponseDTO {
  id: string
  requestNumber: string
  dealerId: string
  dealerName: string
  carModelId: string
  carModelName: string
  quantity: number
  urgency: string
  expectedDate: string
  status: 'PENDING' | 'APPROVED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'
  reason?: string
  createdAt: string
  updatedAt: string
}

// ==================== CONTRACT ====================
export interface ContractCreateDTO {
  orderId: string
  customerId: string
  contractType: 'SALES' | 'INSTALLMENT'
  terms: string
  validFrom: string
  validTo: string
}

export interface ContractResponseDTO {
  id: string
  contractNumber: string
  orderId: string
  customerId: string
  customerName: string
  contractType: string
  terms: string
  validFrom: string
  validTo: string
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'TERMINATED'
  signedDate?: string
  createdAt: string
}

// ==================== PAYMENT ====================
export interface PaymentCreateDTO {
  orderId: string
  amount: number
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD'
  transactionReference?: string
  note?: string
}

export interface PaymentResponseDTO {
  id: string
  orderId: string
  orderNumber: string
  amount: number
  paymentMethod: string
  transactionReference?: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  note?: string
  createdAt: string
}

// ==================== PRODUCT (MANUFACTURER) ====================
export interface ProductCreateDTO {
  name: string
  model: string
  version: string
  specifications: {
    batteryCapacity: string
    range: string
    maxSpeed: string
    acceleration: string
    chargingTime: string
    seats: number
    transmission: string
    [key: string]: any
  }
  basePrice: number
  colors: string[]
  images?: string[]
}

export interface ProductResponseDTO {
  id: string
  name: string
  model: string
  version: string
  specifications: any
  basePrice: number
  colors: string[]
  images: string[]
  status: 'ACTIVE' | 'DISCONTINUED'
  totalProduced: number
  createdAt: string
  updatedAt: string
}

// ==================== INVENTORY ====================
export interface InventoryUpdateDTO {
  productId: string
  quantity: number
  operation: 'ADD' | 'REMOVE' | 'SET'
  note?: string
}

export interface InventoryResponseDTO {
  id: string
  productId: string
  productName: string
  quantity: number
  location: string
  lastUpdated: string
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'
}

// ==================== ALLOCATION ====================
export interface AllocationCreateDTO {
  dealerId: string
  productId: string
  quantity: number
  allocationDate: string
  note?: string
}

export interface AllocationResponseDTO {
  id: string
  dealerId: string
  dealerName: string
  productId: string
  productName: string
  quantity: number
  allocationDate: string
  status: 'PENDING' | 'ALLOCATED' | 'DELIVERED'
  note?: string
  createdAt: string
}

// ==================== DEALER ====================
export interface DealerCreateDTO {
  name: string
  code: string
  address: string
  phone: string
  email: string
  managerName: string
  region: string
}

export interface DealerResponseDTO {
  id: string
  name: string
  code: string
  address: string
  phone: string
  email: string
  managerName: string
  region: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  totalSales: number
  createdAt: string
}

// ==================== PRICING POLICY ====================
export interface PricingPolicyCreateDTO {
  productId: string
  region: string
  basePrice: number
  discountPercentage: number
  validFrom: string
  validTo: string
}

export interface PricingPolicyResponseDTO {
  id: string
  productId: string
  productName: string
  region: string
  basePrice: number
  discountPercentage: number
  finalPrice: number
  validFrom: string
  validTo: string
  status: 'ACTIVE' | 'EXPIRED'
  createdAt: string
}

// ==================== REPORTS ====================
export interface SalesReportDTO {
  period: {
    from: string
    to: string
  }
  totalRevenue: number
  ordersCount: number
  topProducts: Array<{
    productId: string
    productName: string
    quantity: number
    revenue: number
  }>
  comparisonRate: {
    revenueChange: number
    ordersChange: number
  }
  chartData: {
    labels: string[]
    values: number[]
  }
}

export interface InventoryReportDTO {
  dealerId?: string
  modelId?: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    status: string
    location: string
  }>
  totalValue: number
  lowStockItems: number
}

export interface DebtReportDTO {
  dealerId?: string
  customerId?: string
  debts: Array<{
    customerId: string
    customerName: string
    totalDebt: number
    overdueAmount: number
    lastPaymentDate: string
  }>
  totalDebt: number
  totalOverdue: number
}

export interface DashboardDTO {
  type: 'DEALER' | 'MANUFACTURER' | 'ADMIN'
  scope: string
  stats: {
    [key: string]: number | string
  }
  recentActivities: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
  charts: {
    [key: string]: {
      labels: string[]
      values: number[]
    }
  }
}

// ==================== NOTIFICATION ====================
export interface NotificationRequestDTO {
  recipientIds: string[]
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  channels: Array<'EMAIL' | 'SMS' | 'IN_APP'>
  templateId?: string
}

export interface NotificationResponseDTO {
  id: string
  recipientId: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

export interface TemplateCreateDTO {
  name: string
  subject: string
  body: string
  type: 'EMAIL' | 'SMS'
  variables: string[]
}

export interface TemplateResponseDTO {
  id: string
  name: string
  subject: string
  body: string
  type: string
  variables: string[]
  createdAt: string
}

// ==================== COMMON ====================
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}
