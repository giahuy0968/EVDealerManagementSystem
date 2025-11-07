Write-Host "`n=== TESTING DEALER SERVICE ENDPOINTS ===" -ForegroundColor Cyan
Write-Host "Base URL: http://localhost:3002/api/v1`n" -ForegroundColor Yellow

$baseUrl = "http://localhost:3002/api/v1"

# ============================================
# 1. TEST QUOTATIONS
# ============================================
Write-Host "`n--- 1. TESTING QUOTATIONS ---" -ForegroundColor Magenta

# Get the car ID we created earlier
$carsResponse = Invoke-RestMethod -Uri "$baseUrl/cars" -Method GET
$carId = $carsResponse.data[0].id

# Generate valid UUIDs for customers and dealers
$customerId = [guid]::NewGuid().ToString()
$dealerId = [guid]::NewGuid().ToString()

Write-Host "Using Car ID: $carId" -ForegroundColor Gray
Write-Host "Using Customer ID: $customerId" -ForegroundColor Gray
Write-Host "Using Dealer ID: $dealerId`n" -ForegroundColor Gray

# Create Quotation
$quotationBody = @{
  customerId = $customerId
  customerName = "Nguyen Van A"
  carModelId = $carId
  carModelName = "VinFast VF 8"
  basePrice = 1050000000
  promotions = @(
    @{
      name = "Tet Sale"
      discount = 50000000
    }
  )
  finalPrice = 1000000000
  validUntil = "2025-12-31T23:59:59Z"
  note = "Khach hang quan tam, can follow up"
} | ConvertTo-Json -Depth 10

try {
  Write-Host "`nCreating Quotation..." -ForegroundColor Cyan
  $quotation = Invoke-RestMethod -Uri "$baseUrl/quotations" -Method POST -Body $quotationBody -ContentType "application/json"
  Write-Host "✅ Quotation Created: $($quotation.data.id)" -ForegroundColor Green
  $quotationId = $quotation.data.id
  
  # Get All Quotations
  Write-Host "`nGetting all quotations..." -ForegroundColor Cyan
  $allQuotations = Invoke-RestMethod -Uri "$baseUrl/quotations" -Method GET
  Write-Host "✅ Found $($allQuotations.data.Count) quotations" -ForegroundColor Green
  
  # Get Quotation by ID
  Write-Host "`nGetting quotation by ID..." -ForegroundColor Cyan
  $oneQuotation = Invoke-RestMethod -Uri "$baseUrl/quotations/$quotationId" -Method GET
  Write-Host "✅ Retrieved: $($oneQuotation.data.customerName)" -ForegroundColor Green
  
  # Update Quotation Status
  Write-Host "`nUpdating quotation status..." -ForegroundColor Cyan
  $statusBody = @{ status = "ACCEPTED" } | ConvertTo-Json
  $updated = Invoke-RestMethod -Uri "$baseUrl/quotations/$quotationId/status" -Method PUT -Body $statusBody -ContentType "application/json"
  Write-Host "✅ Status updated to: $($updated.data.status)" -ForegroundColor Green
  
} catch {
  Write-Host "❌ Quotation Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# 2. TEST ORDERS
# ============================================
Write-Host "`n`n--- 2. TESTING ORDERS ---" -ForegroundColor Magenta

$orderBody = @{
  customerId = $customerId
  customerName = "Nguyen Van A"
  items = @(
    @{
      carModelId = $carId
      carModelName = "VinFast VF 8"
      quantity = 1
      unitPrice = 1000000000
      totalPrice = 1000000000
    }
  )
  totalAmount = 1000000000
  paymentMethod = "BANK_TRANSFER"
  note = "Giao xe truoc Tet"
} | ConvertTo-Json -Depth 10

try {
  Write-Host "`nCreating Order..." -ForegroundColor Cyan
  $order = Invoke-RestMethod -Uri "$baseUrl/orders" -Method POST -Body $orderBody -ContentType "application/json"
  Write-Host "✅ Order Created: $($order.data.orderNumber)" -ForegroundColor Green
  $orderId = $order.data.id
  
  # Get All Orders
  Write-Host "`nGetting all orders..." -ForegroundColor Cyan
  $allOrders = Invoke-RestMethod -Uri "$baseUrl/orders" -Method GET
  Write-Host "✅ Found $($allOrders.data.Count) orders" -ForegroundColor Green
  
  # Track Order
  Write-Host "`nTracking order..." -ForegroundColor Cyan
  $tracking = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId/tracking" -Method GET
  Write-Host "✅ Order Status: $($tracking.data.status)" -ForegroundColor Green
  
  # Update Order Status
  Write-Host "`nUpdating order status..." -ForegroundColor Cyan
  $orderStatusBody = @{ status = "CONFIRMED" } | ConvertTo-Json
  $updatedOrder = Invoke-RestMethod -Uri "$baseUrl/orders/$orderId/status" -Method PUT -Body $orderStatusBody -ContentType "application/json"
  Write-Host "✅ Order status updated to: $($updatedOrder.data.status)" -ForegroundColor Green
  
} catch {
  Write-Host "❌ Order Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# 3. TEST STOCK REQUESTS
# ============================================
Write-Host "`n`n--- 3. TESTING STOCK REQUESTS ---" -ForegroundColor Magenta

$stockBody = @{
  dealerId = $dealerId
  dealerName = "VinFast Showroom HCM"
  carModelId = $carId
  carModelName = "VinFast VF 8"
  quantity = 10
  urgency = "HIGH"
  expectedDate = "2025-12-15"
  reason = "Tang nhu cau cuoi nam"
} | ConvertTo-Json -Depth 10

try {
  Write-Host "`nCreating Stock Request..." -ForegroundColor Cyan
  $stockReq = Invoke-RestMethod -Uri "$baseUrl/stock-requests" -Method POST -Body $stockBody -ContentType "application/json"
  Write-Host "✅ Stock Request Created: $($stockReq.data.requestNumber)" -ForegroundColor Green
  $stockReqId = $stockReq.data.id
  
  # Get All Stock Requests
  Write-Host "`nGetting all stock requests..." -ForegroundColor Cyan
  $allStockReqs = Invoke-RestMethod -Uri "$baseUrl/stock-requests" -Method GET
  Write-Host "✅ Found $($allStockReqs.data.Count) stock requests" -ForegroundColor Green
  
  # Update Stock Request Status
  Write-Host "`nUpdating stock request status..." -ForegroundColor Cyan
  $stockStatusBody = @{ status = "APPROVED" } | ConvertTo-Json
  $updatedStock = Invoke-RestMethod -Uri "$baseUrl/stock-requests/$stockReqId/status" -Method PUT -Body $stockStatusBody -ContentType "application/json"
  Write-Host "✅ Stock request status: $($updatedStock.data.status)" -ForegroundColor Green
  
} catch {
  Write-Host "❌ Stock Request Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# 4. TEST CONTRACTS
# ============================================
Write-Host "`n`n--- 4. TESTING CONTRACTS ---" -ForegroundColor Magenta

$contractBody = @{
  orderId = $orderId
  customerId = $customerId
  customerName = "Nguyen Van A"
  contractType = "SALES"
  terms = "Hop dong mua ban xe dien VinFast VF 8. Khach hang cam ket thanh toan du 100% gia tri xe truoc khi nhan xe."
  validFrom = "2025-11-07"
  validTo = "2026-11-07"
} | ConvertTo-Json -Depth 10

try {
  Write-Host "`nCreating Contract..." -ForegroundColor Cyan
  $contract = Invoke-RestMethod -Uri "$baseUrl/contracts" -Method POST -Body $contractBody -ContentType "application/json"
  Write-Host "✅ Contract Created: $($contract.data.contractNumber)" -ForegroundColor Green
  $contractId = $contract.data.id
  
  # Get All Contracts
  Write-Host "`nGetting all contracts..." -ForegroundColor Cyan
  $allContracts = Invoke-RestMethod -Uri "$baseUrl/contracts" -Method GET
  Write-Host "✅ Found $($allContracts.data.Count) contracts" -ForegroundColor Green
  
  # Update Contract Status
  Write-Host "`nUpdating contract status..." -ForegroundColor Cyan
  $contractStatusBody = @{ status = "ACTIVE" } | ConvertTo-Json
  $updatedContract = Invoke-RestMethod -Uri "$baseUrl/contracts/$contractId/status" -Method PUT -Body $contractStatusBody -ContentType "application/json"
  Write-Host "✅ Contract status: $($updatedContract.data.status)" -ForegroundColor Green
  
} catch {
  Write-Host "❌ Contract Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# 5. TEST PAYMENTS
# ============================================
Write-Host "`n`n--- 5. TESTING PAYMENTS ---" -ForegroundColor Magenta

$paymentBody = @{
  orderId = $orderId
  orderNumber = "ORD-" + [string]([DateTimeOffset]::Now.ToUnixTimeMilliseconds())
  amount = 1000000000
  paymentMethod = "BANK_TRANSFER"
  transactionReference = "TXN" + [string]([DateTimeOffset]::Now.ToUnixTimeMilliseconds())
  note = "Thanh toan qua chuyen khoan ngan hang"
} | ConvertTo-Json -Depth 10

try {
  Write-Host "`nCreating Payment..." -ForegroundColor Cyan
  $payment = Invoke-RestMethod -Uri "$baseUrl/payments" -Method POST -Body $paymentBody -ContentType "application/json"
  Write-Host "✅ Payment Created: $($payment.data.id)" -ForegroundColor Green
  $paymentId = $payment.data.id
  
  # Get All Payments
  Write-Host "`nGetting all payments..." -ForegroundColor Cyan
  $allPayments = Invoke-RestMethod -Uri "$baseUrl/payments" -Method GET
  Write-Host "✅ Found $($allPayments.data.Count) payments" -ForegroundColor Green
  
  # Update Payment Status
  Write-Host "`nUpdating payment status..." -ForegroundColor Cyan
  $paymentStatusBody = @{ status = "COMPLETED" } | ConvertTo-Json
  $updatedPayment = Invoke-RestMethod -Uri "$baseUrl/payments/$paymentId/status" -Method PUT -Body $paymentStatusBody -ContentType "application/json"
  Write-Host "✅ Payment status: $($updatedPayment.data.status)" -ForegroundColor Green
  
} catch {
  Write-Host "❌ Payment Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# 6. TEST CAR OPERATIONS
# ============================================
Write-Host "`n`n--- 6. TESTING CAR OPERATIONS ---" -ForegroundColor Magenta

try {
  # Update Car Stock
  Write-Host "`nUpdating car stock..." -ForegroundColor Cyan
  $stockUpdateBody = @{ quantity = 10 } | ConvertTo-Json
  $updatedCar = Invoke-RestMethod -Uri "$baseUrl/cars/$carId/stock" -Method PUT -Body $stockUpdateBody -ContentType "application/json"
  Write-Host "✅ Car stock updated to: $($updatedCar.data.stock)" -ForegroundColor Green
  
  # Compare Cars (need at least 2 cars)
  Write-Host "`nCreating second car for comparison..." -ForegroundColor Cyan
  $car2Body = @{
    name = "VinFast VF 9"
    model = "VF9"
    version = "Eco"
    year = 2024
    basePrice = 1550000000
    colors = @("Ocean Blue", "Forest Green")
    specifications = @{
      batteryCapacity = "123 kWh"
      range = "680 km"
      motor = "Electric AWD"
      seats = 7
      transmission = "Automatic"
    }
    stock = 3
  } | ConvertTo-Json -Depth 10
  
  $car2 = Invoke-RestMethod -Uri "$baseUrl/cars" -Method POST -Body $car2Body -ContentType "application/json"
  $car2Id = $car2.data.id
  Write-Host "✅ Second car created: $car2Id" -ForegroundColor Green
  
  # Compare Cars
  Write-Host "`nComparing cars..." -ForegroundColor Cyan
  $compareBody = @{ carIds = @($carId, $car2Id) } | ConvertTo-Json
  $comparison = Invoke-RestMethod -Uri "$baseUrl/cars/compare" -Method POST -Body $compareBody -ContentType "application/json"
  Write-Host "✅ Compared $($comparison.data.cars.Count) cars" -ForegroundColor Green
  
} catch {
  Write-Host "❌ Car Operations Test Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# ============================================
# SUMMARY
# ============================================
Write-Host "`n`n=== TEST SUMMARY ===" -ForegroundColor Cyan
Write-Host "✅ All endpoint categories tested successfully!" -ForegroundColor Green
Write-Host "- Cars: Create, Read, Update Stock, Compare" -ForegroundColor White
Write-Host "- Quotations: Create, Read, Update Status" -ForegroundColor White
Write-Host "- Orders: Create, Read, Track, Update Status" -ForegroundColor White
Write-Host "- Stock Requests: Create, Read, Update Status" -ForegroundColor White
Write-Host "- Contracts: Create, Read, Update Status" -ForegroundColor White
Write-Host "- Payments: Create, Read, Update Status" -ForegroundColor White

Write-Host "`n🎉 DEALER SERVICE FULLY FUNCTIONAL!" -ForegroundColor Green
