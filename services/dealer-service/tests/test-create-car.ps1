$body = @{
  name = "VinFast VF 8"
  model = "VF8"
  version = "Plus"
  year = 2024
  basePrice = 1050000000
  colors = @("Pearl White", "Midnight Black", "Ruby Red")
  specifications = @{
    batteryCapacity = "87.7 kWh"
    range = "447 km"
    motor = "Electric AWD"
    power = "300 kW"
    torque = "500 Nm"
    seats = 5
    transmission = "Automatic"
    chargingTime = "7 hours (AC), 40 min (DC)"
  }
  images = @(
    "https://example.com/vf8-front.jpg"
    "https://example.com/vf8-side.jpg"
  )
  stock = 5
  # dealerId = "dealer-hcm-001"  # Optional - removed for now
} | ConvertTo-Json -Depth 10

Write-Host "Creating VinFast VF 8 car..." -ForegroundColor Cyan
Write-Host "Request body:" -ForegroundColor Yellow
Write-Host $body

try {
  $response = Invoke-RestMethod -Uri http://localhost:3002/api/v1/cars -Method POST -Body $body -ContentType "application/json"
  Write-Host "`n✅ Car created successfully!" -ForegroundColor Green
  Write-Host ($response | ConvertTo-Json -Depth 10)
} catch {
  Write-Host "`n❌ Error creating car:" -ForegroundColor Red
  Write-Host $_.Exception.Message
  Write-Host $_.ErrorDetails.Message
}
