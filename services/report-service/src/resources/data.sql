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
    }
]);
