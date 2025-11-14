// Simple test without TypeORM - just HTTP server
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Test routes
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Dealer Service is running!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/cars', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        model: 'Tesla Model 3',
        manufacturer: 'Tesla',
        year: 2024,
        price: 1200000000,
        stock: 5
      },
      {
        id: '2',
        model: 'BYD Seal',
        manufacturer: 'BYD',
        year: 2024,
        price: 950000000,
        stock: 8
      }
    ]
  });
});

app.get('/api/v1/orders', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        customerName: 'Nguyễn Văn A',
        status: 'PENDING',
        totalAmount: 1200000000,
        createdAt: new Date().toISOString()
      }
    ]
  });
});

app.get('/api/v1/quotations', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        quotationNumber: 'QUO-2024-001',
        customerName: 'Trần Thị B',
        status: 'SENT',
        totalPrice: 950000000,
        createdAt: new Date().toISOString()
      }
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Dealer Service TEST MODE running on http://localhost:${PORT}`);
  console.log(`📊 Test endpoints:`);
  console.log(`   - GET http://localhost:${PORT}/health`);
  console.log(`   - GET http://localhost:${PORT}/api/v1/cars`);
  console.log(`   - GET http://localhost:${PORT}/api/v1/orders`);
  console.log(`   - GET http://localhost:${PORT}/api/v1/quotations`);
});
