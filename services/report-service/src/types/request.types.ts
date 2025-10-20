export interface ReportRequest {
startDate: Date;
endDate: Date;
dealerId?: string;
region?: string;
period?: 'DAILY' | 'MONTHLY' | 'YEARLY';
}

export interface DashboardRequest {
dealerId?: string;
userType: 'dealer' | 'manufacturer' | 'admin';
}

export interface SalesReportRequest extends ReportRequest {
groupBy?: 'model' | 'region' | 'staff' | 'period';
}

export interface ForecastRequest {
modelId: string;
region: string;
periods: number;
}

export interface ExportRequest extends ReportRequest {
format: 'PDF' | 'EXCEL' | 'CSV';
reportType: string;
}
