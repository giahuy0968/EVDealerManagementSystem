// MongoDB sample data for testing

// Insert sample sales data
db.sales_daily.insertMany([
    {
        "date": ISODate("2024-01-15"),
        "dealerId": "dealer001",
        "staffId": "staff001",
        "modelId": "model_ev9",
        "quantity": 2,
        "revenue": 120000.0,
        "profit": 24000.0,
        "region": "HCMC",
        "createdAt": ISODate("2024-01-15T10:00:00Z")
    },
    {
        "date": ISODate("2024-01-16"),
        "dealerId": "dealer001",
        "staffId": "staff002",
        "modelId": "model_ev6",
        "quantity": 1,
        "revenue": 45000.0,
        "profit": 9000.0,
        "region": "HCMC",
        "createdAt": ISODate("2024-01-16T14:30:00Z")
    },
    {
        "date": ISODate("2024-01-17"),
        "dealerId": "dealer002",
        "staffId": "staff003",
        "modelId": "model_ev9",
        "quantity": 1,
        "revenue": 60000.0,
        "profit": 12000.0,
        "region": "HN",
        "createdAt": ISODate("2024-01-17T09:15:00Z")
    },
    {
        "date": ISODate("2024-01-18"),
        "dealerId": "dealer001",
        "staffId": "staff001",
        "modelId": "model_ev3",
        "quantity": 3,
        "revenue": 90000.0,
        "profit": 18000.0,
        "region": "HCMC",
        "createdAt": ISODate("2024-01-18T11:20:00Z")
    },
    {
        "date": ISODate("2024-01-19"),
        "dealerId": "dealer002",
        "staffId": "staff004",
        "modelId": "model_ev6",
        "quantity": 2,
        "revenue": 90000.0,
        "profit": 18000.0,
        "region": "HN",
        "createdAt": ISODate("2024-01-19T16:45:00Z")
    }
]);

// Insert sample inventory data
db.inventory_snapshots.insertMany([
    {
        "date": ISODate("2024-01-20"),
        "dealerId": "dealer001",
        "modelId": "model_ev9",
        "quantity": 5,
        "value": 300000.0,
        "daysInStockAvg": 15.5,
        "turnoverRate": 2.1,
        "createdAt": ISODate("2024-01-20T00:00:00Z")
    },
    {
        "date": ISODate("2024-01-20"),
        "dealerId": "dealer001",
        "modelId": "model_ev6",
        "quantity": 3,
        "value": 135000.0,
        "daysInStockAvg": 10.2,
        "turnoverRate": 3.2,
        "createdAt": ISODate("2024-01-20T00:00:00Z")
    },
    {
        "date": ISODate("2024-01-20"),
        "dealerId": "dealer001",
        "modelId": "model_ev3",
        "quantity": 8,
        "value": 240000.0,
        "daysInStockAvg": 8.7,
        "turnoverRate": 4.5,
        "createdAt": ISODate("2024-01-20T00:00:00Z")
    },
    {
        "date": ISODate("2024-01-20"),
        "dealerId": "dealer002",
        "modelId": "model_ev9",
        "quantity": 4,
        "value": 240000.0,
        "daysInStockAvg": 12.3,
        "turnoverRate": 2.8,
        "createdAt": ISODate("2024-01-20T00:00:00Z")
    },
    {
        "date": ISODate("2024-01-20"),
        "dealerId": "dealer002",
        "modelId": "model_ev6",
        "quantity": 6,
        "value": 270000.0,
        "daysInStockAvg": 9.8,
        "turnoverRate": 3.6,
        "createdAt": ISODate("2024-01-20T00:00:00Z")
    }
]);

// Insert sample customer metrics
db.customer_metrics.insertMany([
    {
        "date": ISODate("2024-01-20"),
        "dealerId": "dealer001",
        "newCustomers": 8,
        "returningCustomers": 12,
        "testDrives": 15,
        "conversionRate": 25.5,
        "avgOrderValue": 55000.0,
        "createdAt": ISODate("2024-01-20T00:00:00Z")
    },
    {
        "date": ISODate("2024-01-20"),
        "dealerId": "dealer002",
        "newCustomers": 6,
        "returningCustomers": 8,
        "testDrives": 12,
        "conversionRate": 22.8,
        "avgOrderValue": 52000.0,
        "createdAt": ISODate("2024-01-20T00:00:00Z")
    },
    {
        "date": ISODate("2024-01-19"),
        "dealerId": "dealer001",
        "newCustomers": 5,
        "returningCustomers": 10,
        "testDrives": 12,
        "conversionRate": 28.3,
        "avgOrderValue": 58000.0,
        "createdAt": ISODate("2024-01-19T00:00:00Z")
    }
]);

// Insert sample financial metrics
db.financial_metrics.insertMany([
    {
        "date": ISODate("2024-01-20"),
        "dealerId": "dealer001",
        "totalRevenue": 165000.0,
        "totalProfit": 33000.0,
        "outstandingDebt": 50000.0,
        "paidOrders": 3,
        "pendingOrders": 2,
        "paymentCompletionRate": 60.0,
        "createdAt": ISODate("2024-01-20T00:00:00Z")
    },
    {
        "date": ISODate("2024-01-20"),
        "dealerId": "dealer002",
        "totalRevenue": 120000.0,
        "totalProfit": 24000.0,
        "outstandingDebt": 35000.0,
        "paidOrders": 2,
        "pendingOrders": 1,
        "paymentCompletionRate": 66.7,
        "createdAt": ISODate("2024-01-20T00:00:00Z")
    },
    {
        "date": ISODate("2024-01-19"),
        "dealerId": "dealer001",
        "totalRevenue": 90000.0,
        "totalProfit": 18000.0,
        "outstandingDebt": 25000.0,
        "paidOrders": 2,
        "pendingOrders": 1,
        "paymentCompletionRate": 66.7,
        "createdAt": ISODate("2024-01-19T00:00:00Z")
    }
]);

// Insert sample forecast results
db.forecast_results.insertMany([
    {
        "modelId": "model_ev9",
        "region": "HCMC",
        "forecastDate": ISODate("2024-01-25"),
        "predictedDemand": 85.0,
        "confidenceInterval": {
            "lower": 65.0,
            "upper": 105.0
        },
        "accuracy": 87.2,
        "generatedAt": ISODate("2024-01-20T10:00:00Z")
    },
    {
        "modelId": "model_ev6",
        "region": "HCMC",
        "forecastDate": ISODate("2024-01-25"),
        "predictedDemand": 120.0,
        "confidenceInterval": {
            "lower": 95.0,
            "upper": 145.0
        },
        "accuracy": 84.5,
        "generatedAt": ISODate("2024-01-20T10:00:00Z")
    },
    {
        "modelId": "model_ev9",
        "region": "HN",
        "forecastDate": ISODate("2024-01-25"),
        "predictedDemand": 65.0,
        "confidenceInterval": {
            "lower": 50.0,
            "upper": 80.0
        },
        "accuracy": 89.1,
        "generatedAt": ISODate("2024-01-20T10:00:00Z")
    }
]);