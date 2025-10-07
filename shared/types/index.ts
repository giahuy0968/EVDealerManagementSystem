// User Types
export enum UserRole {
  ADMIN = 'admin',
  DEALER_MANAGER = 'dealer_manager',
  DEALER_STAFF = 'dealer_staff',
  MANUFACTURER_STAFF = 'manufacturer_staff',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  dealerId?: string;
  manufacturerId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserRegistration {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  dealerId?: string;
  manufacturerId?: string;
}

// Vehicle Types
export enum VehicleStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  IN_TRANSIT = 'in_transit',
  MAINTENANCE = 'maintenance',
}

export enum VehicleType {
  SEDAN = 'sedan',
  SUV = 'suv',
  HATCHBACK = 'hatchback',
  COUPE = 'coupe',
  CONVERTIBLE = 'convertible',
  TRUCK = 'truck',
  VAN = 'van',
}

export enum FuelType {
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
  PLUGIN_HYBRID = 'plugin_hybrid',
}

export interface IVehicle {
  id: string;
  manufacturerId: string;
  model: string;
  year: number;
  type: VehicleType;
  fuelType: FuelType;
  batteryCapacity: number; // kWh
  range: number; // km
  price: number;
  features: string[];
  specifications: Record<string, any>;
  images: string[];
  status: VehicleStatus;
  vin?: string;
  dealerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Customer Types
export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  VIP = 'vip',
}

export enum CustomerSegment {
  FIRST_TIME_BUYER = 'first_time_buyer',
  RETURNING_CUSTOMER = 'returning_customer',
  LUXURY_BUYER = 'luxury_buyer',
  FLEET_CUSTOMER = 'fleet_customer',
}

export interface ICustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  dateOfBirth?: Date;
  status: CustomerStatus;
  segment: CustomerSegment;
  preferences: {
    vehicleTypes: VehicleType[];
    priceRange: {
      min: number;
      max: number;
    };
    features: string[];
  };
  dealerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export enum OrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PRODUCTION = 'in_production',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PARTIAL = 'partial',
  PAID = 'paid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export interface IOrder {
  id: string;
  customerId: string;
  dealerId: string;
  vehicleId: string;
  salesRepId: string;
  orderNumber: string;
  totalAmount: number;
  downPayment: number;
  financeAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dealer Types
export enum DealerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export interface IDealer {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  managerId: string;
  status: DealerStatus;
  salesTarget: number;
  territory: string[];
  manufacturers: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Manufacturer Types
export interface IManufacturer {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website: string;
  description: string;
  logo: string;
  createdAt: Date;
  updatedAt: Date;
}

// Test Drive Types
export enum TestDriveStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

export interface ITestDrive {
  id: string;
  customerId: string;
  vehicleId: string;
  dealerId: string;
  salesRepId: string;
  scheduledDate: Date;
  duration: number; // minutes
  status: TestDriveStatus;
  feedback?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export enum NotificationType {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface INotification {
  id: string;
  recipientId: string;
  recipientType: 'user' | 'customer';
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  data?: Record<string, any>;
  scheduledAt?: Date;
  sentAt?: Date;
  readAt?: Date;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Event Types for Message Queue
export enum EventType {
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  
  VEHICLE_CREATED = 'vehicle.created',
  VEHICLE_UPDATED = 'vehicle.updated',
  VEHICLE_DELETED = 'vehicle.deleted',
  
  CUSTOMER_CREATED = 'customer.created',
  CUSTOMER_UPDATED = 'customer.updated',
  
  ORDER_CREATED = 'order.created',
  ORDER_UPDATED = 'order.updated',
  ORDER_CONFIRMED = 'order.confirmed',
  ORDER_DELIVERED = 'order.delivered',
  ORDER_CANCELLED = 'order.cancelled',
  
  TEST_DRIVE_SCHEDULED = 'test_drive.scheduled',
  TEST_DRIVE_COMPLETED = 'test_drive.completed',
  
  PAYMENT_RECEIVED = 'payment.received',
  PAYMENT_FAILED = 'payment.failed',
  
  NOTIFICATION_SEND = 'notification.send',
}

export interface IEvent {
  id: string;
  type: EventType;
  payload: any;
  userId?: string;
  timestamp: Date;
  source: string;
  version: string;
}