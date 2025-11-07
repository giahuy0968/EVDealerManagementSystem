# 🚀 Dealer Service API - Postman Testing Guide

## 📦 Files Created

- **`Dealer-Service-API.postman_collection.json`** - Complete API collection with 40+ endpoints
- **`Dealer-Service-Local.postman_environment.json`** - Environment variables for local testing

---

## 🔧 Setup Instructions

### 1. Import into Postman

#### Option A: Postman Desktop App
1. Open Postman
2. Click **Import** button (top left)
3. Drag & drop or select files:
   - `Dealer-Service-API.postman_collection.json`
   - `Dealer-Service-Local.postman_environment.json`
4. Click **Import**

#### Option B: Postman Web
1. Go to https://web.postman.co
2. Click **Import** → **Upload Files**
3. Select both JSON files
4. Click **Import**

### 2. Set Environment
1. Click environment dropdown (top right)
2. Select **"Dealer Service - Local"**
3. Verify `baseUrl` = `http://localhost:3002/api/v1`

### 3. Start Service
```powershell
cd services\dealer-service
npm run dev
```

Or check if already running:
```powershell
curl http://localhost:3002/health
```

---

## 📋 Collection Structure

### 🏥 **Health Check**
- GET `/health` - Service health status

### 🚗 **Cars** (7 endpoints)
- GET `/cars` - Get all cars
- GET `/cars/:id` - Get car by ID
- POST `/cars` - Create new car
- PUT `/cars/:id` - Update car
- PUT `/cars/:id/stock` - Update stock quantity
- POST `/cars/compare` - Compare multiple cars
- DELETE `/cars/:id` - Delete car

### 💰 **Quotations** (6 endpoints)
- GET `/quotations` - Get all quotations
- GET `/quotations/:id` - Get quotation by ID
- POST `/quotations` - Create quotation
- PUT `/quotations/:id` - Update quotation
- PUT `/quotations/:id/status` - Update status
- DELETE `/quotations/:id` - Delete quotation

### 📦 **Orders** (6 endpoints)
- GET `/orders` - Get all orders
- GET `/orders/:id` - Get order by ID
- POST `/orders` - Create order
- GET `/orders/:id/tracking` - Track order
- PUT `/orders/:id/status` - Update order status
- DELETE `/orders/:id` - Delete order

### 📊 **Stock Requests** (5 endpoints)
- GET `/stock-requests` - Get all requests
- GET `/stock-requests/:id` - Get request by ID
- POST `/stock-requests` - Create request
- PUT `/stock-requests/:id/status` - Update status
- DELETE `/stock-requests/:id` - Delete request

### 📄 **Contracts** (6 endpoints)
- GET `/contracts` - Get all contracts
- GET `/contracts/:id` - Get contract by ID
- POST `/contracts` - Create contract
- PUT `/contracts/:id` - Update contract
- PUT `/contracts/:id/status` - Update status
- DELETE `/contracts/:id` - Delete contract

### 💳 **Payments** (5 endpoints)
- GET `/payments` - Get all payments
- GET `/payments/:id` - Get payment by ID
- POST `/payments` - Create payment
- PUT `/payments/:id/status` - Update status
- DELETE `/payments/:id` - Delete payment

---

## 🎯 Quick Start Testing Flow

### **Recommended Order:**

1. **Health Check** - Verify service is running
2. **Create Car** - Creates a car and auto-saves `carId` variable
3. **Get All Cars** - View all cars in database
4. **Create Quotation** - Uses saved `carId`
5. **Create Order** - Uses saved `carId` and `quotationId`
6. **Create Payment** - Uses saved `orderId`
7. **Create Contract** - Uses saved `orderId`
8. **Create Stock Request** - Uses saved `carId`

### **Auto-Variables Feature:**
Collection includes **Test Scripts** that automatically save IDs:
- Creating a car → saves `carId`
- Creating a quotation → saves `quotationId`
- Creating an order → saves `orderId`
- And so on...

These variables are then used in subsequent requests!

---

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `baseUrl` | API base URL | `http://localhost:3002/api/v1` |
| `carId` | Last created car ID | Auto-saved |
| `quotationId` | Last created quotation ID | Auto-saved |
| `orderId` | Last created order ID | Auto-saved |
| `stockRequestId` | Last created stock request ID | Auto-saved |
| `contractId` | Last created contract ID | Auto-saved |
| `paymentId` | Last created payment ID | Auto-saved |
| `customerId` | Sample customer UUID | `550e8400-...` |
| `dealerId` | Sample dealer UUID | `550e8400-...` |

---

## 📝 Sample Request Bodies

### Create Car
```json
{
  "name": "VinFast VF 9",
  "model": "VF9",
  "version": "Eco",
  "year": 2024,
  "basePrice": 1490000000,
  "colors": ["Sapphire Blue", "Pearl White", "Midnight Black"],
  "specifications": {
    "batteryCapacity": "123 kWh",
    "range": "594 km",
    "motor": "Dual Motor AWD",
    "power": "300 kW",
    "seats": 7
  },
  "stock": 3
}
```

### Create Quotation
```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "customerName": "Nguyen Van A",
  "carModelId": "{{carId}}",
  "carModelName": "VinFast VF 9",
  "basePrice": 1490000000,
  "promotions": [
    {
      "name": "Black Friday Discount",
      "discount": 50000000
    }
  ],
  "totalPrice": 1440000000,
  "validUntil": "2025-12-31"
}
```

### Create Order
```json
{
  "customerId": "550e8400-e29b-41d4-a716-446655440000",
  "customerName": "Tran Thi B",
  "items": [
    {
      "carModelId": "{{carId}}",
      "carModelName": "VinFast VF 9",
      "quantity": 1,
      "unitPrice": 1490000000
    }
  ],
  "totalAmount": 1490000000,
  "paymentMethod": "BANK_TRANSFER"
}
```

---

## 🎨 Status Values

### Quotation Status
- `PENDING` - Initial state
- `ACCEPTED` - Customer accepted
- `REJECTED` - Customer rejected
- `EXPIRED` - Past valid date

### Order Status
- `PENDING` - Awaiting confirmation
- `CONFIRMED` - Order confirmed
- `PROCESSING` - Being processed
- `DELIVERED` - Delivered to customer
- `CANCELLED` - Order cancelled

### Stock Request Status
- `PENDING` - Awaiting approval
- `APPROVED` - Approved by manager
- `FULFILLED` - Stock delivered
- `REJECTED` - Request rejected

### Contract Status
- `DRAFT` - Contract being prepared
- `ACTIVE` - Contract active
- `COMPLETED` - Contract completed
- `TERMINATED` - Contract terminated

### Payment Status
- `PENDING` - Payment pending
- `COMPLETED` - Payment successful
- `FAILED` - Payment failed
- `REFUNDED` - Payment refunded

### Payment Methods
- `CASH` - Cash payment
- `BANK_TRANSFER` - Bank transfer
- `CREDIT_CARD` - Credit card
- `INSTALLMENT` - Installment plan

---

## 🧪 Testing Tips

### 1. **Run Collection**
- Click "..." on collection → **Run collection**
- Select all folders
- Click **Run Dealer Service API**
- View test results

### 2. **Check Responses**
All successful responses follow this format:
```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

### 3. **View Auto-Saved Variables**
- Click eye icon (👁️) next to environment dropdown
- See all current variable values
- IDs are auto-populated after creating resources

### 4. **Modify Variables**
- Edit environment to set custom UUIDs
- Or let Test Scripts auto-populate them

---

## 🐛 Troubleshooting

### Service Not Running
```powershell
# Check if service is running
netstat -ano | findstr :3002

# Start service
cd services\dealer-service
npm run dev
```

### Connection Refused
- Verify service is running on port 3002
- Check `baseUrl` in environment matches your setup
- Ensure no firewall blocking

### Invalid UUID Errors
- UUIDs must be valid format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- Use environment variables for valid sample UUIDs
- Or create resources first to get real IDs

### Validation Errors
- Check required fields in request body
- Verify enum values (status, paymentMethod, etc.)
- Ensure date formats are correct (YYYY-MM-DD)

---

## 📊 Database Check

View data in PostgreSQL:
```sql
-- Connect to database
psql -h localhost -U evuser -d evdealerdb_dev

-- View tables
\dt

-- Query data
SELECT * FROM cars;
SELECT * FROM quotations;
SELECT * FROM orders;
SELECT * FROM stock_requests;
SELECT * FROM contracts;
SELECT * FROM payments;
```

---

## 🎉 Success!

You now have a complete Postman collection with:
- ✅ 40+ API endpoints
- ✅ Auto-variable population
- ✅ Organized into logical folders
- ✅ Sample request bodies
- ✅ Environment configuration

**Happy Testing!** 🚀
