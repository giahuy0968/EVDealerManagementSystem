import { Document, Types } from 'mongoose';

// Base interface for all time-series documents
export interface ITimeSeriesDocument extends Document {
  date: Date;
  dealerId: string;
  createdAt?: Date;
}

// Sales Daily types
export interface ISalesDaily extends ITimeSeriesDocument {
  staffId?: string;
  modelId: string;
  quantity: number;
  revenue: number;
  profit: number;
  region: string;
}

export interface SalesDailyFilter {
  date?: Date | { $gte?: Date; $lte?: Date };
  dealerId?: string | { $in: string[] };
  staffId?: string;
  modelId?: string | { $in: string[] };
  region?: string | { $in: string[] };
}

export interface SalesDailyAggregation {
  _id: string;
  totalQuantity: number;
  totalRevenue: number;
  totalProfit: number;
  averageRevenue: number;
  count: number;
}

// Inventory Snapshot types
export interface IInventorySnapshot extends ITimeSeriesDocument {
  modelId: string;
  quantity: number;
  value: number;
  daysInStockAvg: number;
  turnoverRate: number;
  lowStockAlert: boolean;
}

export interface InventorySnapshotFilter {
  date?: Date | { $gte?: Date; $lte?: Date };
  dealerId?: string | { $in: string[] };
  modelId?: string | { $in: string[] };
  lowStockAlert?: boolean;
}

export interface InventoryAggregation {
  _id: string;
  totalValue: number;
  totalQuantity: number;
  averageDaysInStock: number;
  lowStockCount: number;
  averageTurnoverRate: number;
}

// Customer Metrics types
export interface ICustomerMetrics extends ITimeSeriesDocument {
  newCustomers: number;
  returningCustomers: number;
  testDrives: number;
  conversionRate: number;
  avgOrderValue: number;
  customerSatisfaction: number;
}

export interface CustomerMetricsFilter {
  date?: Date | { $gte?: Date; $lte?: Date };
  dealerId?: string | { $in: string[] };
}

export interface CustomerMetricsAggregation {
  _id: string;
  totalNewCustomers: number;
  totalReturningCustomers: number;
  totalTestDrives: number;
  averageConversionRate: number;
  averageSatisfaction: number;
  averageOrderValue: number;
}

// Forecast Results types
export interface IForecastResults extends Document {
  modelId: string;
  region: string;
  forecastDate: Date;
  predictedDemand: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  actualDemand?: number;
  accuracy?: number;
  generatedAt: Date;
}

export interface ForecastResultsFilter {
  modelId?: string | { $in: string[] };
  region?: string | { $in: string[] };
  forecastDate?: Date | { $gte?: Date; $lte?: Date };
}

// Financial Report types
export interface IFinancialReport extends ITimeSeriesDocument {
  revenue: number;
  profit: number;
  expenses: number;
  debt: number;
  paymentStatus: {
    paid: number;
    pending: number;
    overdue: number;
  };
}

export interface FinancialReportFilter {
  date?: Date | { $gte?: Date; $lte?: Date };
  dealerId?: string | { $in: string[] };
}

export interface FinancialAggregation {
  _id: string;
  totalRevenue: number;
  totalProfit: number;
  totalExpenses: number;
  totalDebt: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
}

// Common Query Types
export interface DateRangeFilter {
  startDate: Date;
  endDate: Date;
}

export interface DealerFilter {
  dealerId?: string;
}

export interface RegionFilter {
  region?: string;
}

export interface ModelFilter {
  modelId?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Aggregation Pipeline Types
export interface SalesAggregationPipeline {
  $match?: any;
  $group?: {
    _id: any;
    quantity?: { $sum: string };
    revenue?: { $sum: string };
    profit?: { $sum: string };
    averageRevenue?: { $avg: string };
    count?: { $sum: number };
  };
  $project?: any;
  $sort?: any;
  $limit?: number;
  $skip?: number;
}

export interface GroupByOptions {
  field: string;
  type: 'daily' | 'monthly' | 'yearly' | 'model' | 'region' | 'dealer';
}

// Cache Key Types
export interface CacheKeyParams {
  dealerId?: string;
  startDate?: Date;
  endDate?: Date;
  modelId?: string;
  region?: string;
  userType?: string;
  reportType?: string;
  format?: string;
}

// Event Processing Types
export interface EventProcessingResult {
  success: boolean;
  processed: boolean;
  message?: string;
  error?: string;
}

export interface BulkProcessingStats {
  total: number;
  successful: number;
  failed: number;
  duplicates: number;
}

// Dashboard Specific Types
export interface DashboardDataFilters {
  dealerId: string;
  userType: 'dealer' | 'manufacturer' | 'admin';
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export interface SalesComparisonFilters {
  dealerId?: string;
  comparisonType: 'YoY' | 'MoM';
  dateRange?: {
    currentStart: Date;
    currentEnd: Date;
    previousStart: Date;
    previousEnd: Date;
  };
}

// Export Specific Types
export interface ExportDataFilters extends DateRangeFilter, Partial<DealerFilter>, Partial<RegionFilter> {
  reportType: 'sales' | 'inventory' | 'customer' | 'financial' | 'forecast';
  format: 'PDF' | 'EXCEL' | 'CSV';
  groupBy?: string;
}

// Forecast Specific Types
export interface ForecastRequestFilters {
  modelId: string;
  region: string;
  periods: number;
  historyMonths?: number;
  confidenceLevel?: number;
}

// Alert Types
export interface AlertThresholds {
  lowStock: number;
  salesDrop: number;
  inventoryAging: number;
  conversionRate: number;
}

export interface AlertConditions {
  type: 'LOW_STOCK' | 'SALES_DROP' | 'INVENTORY_AGING' | 'CONVERSION_RATE_DROP';
  field: string;
  operator: 'lt' | 'gt' | 'lte' | 'gte' | 'eq';
  value: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

// Performance Metrics Types
export interface QueryPerformance {
  collection: string;
  operation: string;
  duration: number;
  filter: any;
  documentCount: number;
  timestamp: Date;
}

export interface DatabaseHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  collections: string[];
  indexes: number;
  lastCheck: Date;
}

// Bulk Operation Types
export interface BulkWriteResult {
  insertedCount: number;
  matchedCount: number;
  modifiedCount: number;
  deletedCount: number;
  upsertedCount: number;
}

export interface BulkOperation {
  type: 'insert' | 'update' | 'delete';
  collection: string;
  documents: any[];
  options?: any;
}

// Index Types
export interface IndexDefinition {
  fields: Record<string, 1 | -1>;
  options?: {
    name?: string;
    unique?: boolean;
    sparse?: boolean;
    background?: boolean;
    expireAfterSeconds?: number;
  };
}

// Migration Types
export interface DatabaseMigration {
  version: number;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
  timestamp: Date;
}

// Export all types
export type {
  ITimeSeriesDocument as TimeSeriesDocument,
  ISalesDaily as SalesDailyDocument,
  IInventorySnapshot as InventorySnapshotDocument,
  ICustomerMetrics as CustomerMetricsDocument,
  IForecastResults as ForecastResultsDocument,
  IFinancialReport as FinancialReportDocument
};