export interface ApiResponse<T> {
success: boolean;
data: T;
message?: string;
timestamp: Date;
}

export interface SalesSummaryResponse {
totalRevenue: number;
totalOrders: number;
totalProfit: number;
growthRate: number;
averageOrderValue: number;
}

export interface DashboardResponse {
salesSummary: SalesSummaryResponse;
inventorySummary: InventorySummaryResponse;
customerMetrics: CustomerMetricsResponse;
topSellingModels: TopSellingModel[];
recentAlerts: Alert[];
}

export interface InventorySummaryResponse {
totalValue: number;
totalItems: number;
lowStockItems: number;
turnoverRate: number;
agingInventory: number;
}

export interface CustomerMetricsResponse {
newCustomers: number;
returningCustomers: number;
conversionRate: number;
testDrives: number;
customerSatisfaction: number;
}

export interface SalesByModelResponse {
modelId: string;
modelName: string;
quantity: number;
revenue: number;
profit: number;
percentage: number;
}

export interface ForecastResponse {
modelId: string;
region: string;
forecastDate: Date;
predictedDemand: number;
confidenceInterval: {
    **lower: number;**

    **upper: number;**

};
accuracy?: number;
}

export interface TopSellingModel {
modelId: string;
modelName: string;
sales: number;
growth: number;
}

export interface Alert {
id: string;
type: 'LOW_STOCK' | 'SALES_DROP' | 'INVENTORY_AGING';
message: string;
severity: 'LOW' | 'MEDIUM' | 'HIGH';
timestamp: Date;
}
