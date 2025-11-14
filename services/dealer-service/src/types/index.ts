// ==================== ENUMS ====================
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  DELIVERING = 'DELIVERING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum QuotationStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
}

export enum StockRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export enum Urgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  TERMINATED = 'TERMINATED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CREDIT_CARD = 'CREDIT_CARD',
  INSTALLMENT = 'INSTALLMENT',
}

// ==================== CAR / VEHICLE DTOs ====================
export interface CarSpecifications {
  batteryCapacity: string;
  range: string;
  maxSpeed: string;
  acceleration: string;
  chargingTime: string;
  seats: number;
  transmission: string;
  [key: string]: any;
}

export interface CarResponseDTO {
  id: string;
  name: string;
  model: string;
  version: string;
  year: number;
  basePrice: number;
  colors: string[];
  specifications: CarSpecifications;
  images: string[];
  stock: number;
  dealerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarCompareRequestDTO {
  carIds: string[];
}

export interface CarCompareResponseDTO {
  cars: CarResponseDTO[];
  comparisonMatrix: Record<string, any>;
}

// ==================== QUOTATION DTOs ====================
export interface PromotionDTO {
  name: string;
  discount: number;
}

export interface QuotationCreateDTO {
  customerId: string;
  carModelId: string;
  promotions?: PromotionDTO[];
  validUntil: string;
  note?: string;
}

export interface QuotationResponseDTO {
  id: string;
  customerId: string;
  customerName: string;
  carModelId: string;
  carModelName: string;
  basePrice: number;
  promotions: PromotionDTO[];
  finalPrice: number;
  validUntil: string;
  status: QuotationStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== ORDER DTOs ====================
export interface OrderItemDTO {
  carModelId: string;
  carModelName?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
}

export interface OrderCreateDTO {
  customerId: string;
  items: OrderItemDTO[];
  paymentMethod: PaymentMethod;
  note?: string;
}

export interface OrderResponseDTO {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItemDTO[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderTrackingDTO {
  orderId: string;
  orderNumber: string;
  currentStatus: OrderStatus;
  timeline: Array<{
    status: string;
    description: string;
    timestamp: string;
    performer?: string;
  }>;
  estimatedDeliveryDate?: string;
}

// ==================== STOCK REQUEST DTOs ====================
export interface StockRequestCreateDTO {
  dealerId: string;
  carModelId: string;
  quantity: number;
  urgency: Urgency;
  expectedDate: string;
  reason?: string;
}

export interface StockRequestResponseDTO {
  id: string;
  requestNumber: string;
  dealerId: string;
  dealerName: string;
  carModelId: string;
  carModelName: string;
  quantity: number;
  urgency: Urgency;
  expectedDate: string;
  status: StockRequestStatus;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== CONTRACT DTOs ====================
export interface ContractCreateDTO {
  orderId: string;
  customerId: string;
  contractType: 'SALES' | 'INSTALLMENT';
  terms: string;
  validFrom: string;
  validTo: string;
}

export interface ContractResponseDTO {
  id: string;
  contractNumber: string;
  orderId: string;
  customerId: string;
  customerName: string;
  contractType: string;
  terms: string;
  validFrom: string;
  validTo: string;
  status: ContractStatus;
  signedDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== PAYMENT DTOs ====================
export interface PaymentCreateDTO {
  orderId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  note?: string;
}

export interface PaymentResponseDTO {
  id: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference?: string;
  status: PaymentStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== COMMON ====================
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
