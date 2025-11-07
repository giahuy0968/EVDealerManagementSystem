# Test Dealer Service API
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DEALER SERVICE API TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3002"

# Test 1: Health Check
Write-Host "[1] Testing Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Gray
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Get Cars
Write-Host "[2] Testing GET /api/v1/cars..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/v1/cars" -Method GET
    Write-Host "✅ SUCCESS - Found $($response.data.Count) cars" -ForegroundColor Green
    Write-Host "Cars:" -ForegroundColor Gray
    $response.data | ForEach-Object {
        Write-Host "  - $($_.model) ($($_.manufacturer)) - Price: $($_.price.ToString('N0')) VND - Stock: $($_.stock)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Get Orders
Write-Host "[3] Testing GET /api/v1/orders..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/v1/orders" -Method GET
    Write-Host "✅ SUCCESS - Found $($response.data.Count) orders" -ForegroundColor Green
    Write-Host "Orders:" -ForegroundColor Gray
    $response.data | ForEach-Object {
        Write-Host "  - $($_.orderNumber) - $($_.customerName) - Status: $($_.status) - Amount: $($_.totalAmount.ToString('N0')) VND" -ForegroundColor White
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Get Quotations
Write-Host "[4] Testing GET /api/v1/quotations..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/v1/quotations" -Method GET
    Write-Host "✅ SUCCESS - Found $($response.data.Count) quotations" -ForegroundColor Green
    Write-Host "Quotations:" -ForegroundColor Gray
    $response.data | ForEach-Object {
        Write-Host "  - $($_.quotationNumber) - $($_.customerName) - Status: $($_.status) - Price: $($_.totalPrice.ToString('N0')) VND" -ForegroundColor White
    }
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TESTING COMPLETE!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
