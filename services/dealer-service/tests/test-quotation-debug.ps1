# Test individual endpoints with error details

Write-Host "Testing Quotation Creation..." -ForegroundColor Cyan

# Generate valid UUIDs
$customerId = [guid]::NewGuid().ToString()
$carId = "df856c36-60f0-447f-8065-c786adc8c489" # Existing car

Write-Host "Using Customer ID: $customerId" -ForegroundColor Gray
Write-Host "Using Car ID: $carId`n" -ForegroundColor Gray

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
  note = "Khach hang quan tam"
} | ConvertTo-Json -Depth 10

Write-Host "Request Body:" -ForegroundColor Yellow
Write-Host $quotationBody

try {
  $response = Invoke-RestMethod -Uri "http://localhost:3002/api/v1/quotations" -Method POST -Body $quotationBody -ContentType "application/json"
  Write-Host "`n✅ Success!" -ForegroundColor Green
  Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
  Write-Host "`n❌ Error:" -ForegroundColor Red
  Write-Host "Status: $($_.Exception.Response.StatusCode.value__)"
  Write-Host "Message: $($_.Exception.Message)"
  if ($_.ErrorDetails.Message) {
    Write-Host "Details: $($_.ErrorDetails.Message)" -ForegroundColor Yellow
  }
}
