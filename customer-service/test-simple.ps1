# Simple test to verify customer service is running
$ErrorActionPreference = "Stop"

Write-Host "Testing Customer Service..." -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n[1] Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3003/actuator/health"
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✓ PASS" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ FAIL: $_" -ForegroundColor Red
}

# Test 2: Get Auth Token
Write-Host "`n[2] Get Auth Token..." -ForegroundColor Yellow
try {
    $email = "test_$(Get-Random)@example.com"
    $registerBody = @{
        username = "test_$(Get-Random)"
        email = $email
        password = "Test123!"
        fullName = "Test User"
    } | ConvertTo-Json
    
    Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/register" `
        -Method POST -Body $registerBody -ContentType "application/json" | Out-Null
    
    $loginBody = @{
        email = $email
        password = "Test123!"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" `
        -Method POST -Body $loginBody -ContentType "application/json"
    
    $global:token = $loginResponse.token
    Write-Host "  ✓ PASS - Got token" -ForegroundColor Green
} catch {
    Write-Host "  ✗ FAIL: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Create Customer
Write-Host "`n[3] Create Customer..." -ForegroundColor Yellow
try {
    $body = @{
        fullName = "John Doe"
        phone = "0$(Get-Random -Minimum 900000000 -Maximum 999999999)"
        email = "john$(Get-Random)@example.com"
        customerType = "INDIVIDUAL"
    } | ConvertTo-Json
    
    $headers = @{
        "Authorization" = "Bearer $global:token"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/v1/customers" `
        -Method POST -Body $body -Headers $headers
    
    $global:customerId = $response.id
    Write-Host "  ✓ PASS - Customer ID: $($global:customerId)" -ForegroundColor Green
} catch {
    Write-Host "  ✗ FAIL: $_" -ForegroundColor Red
}

# Test 4: Get All Customers
Write-Host "`n[4] Get All Customers..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $global:token"
    }
    
    $response = Invoke-RestMethod -Uri "http://localhost:3003/api/v1/customers" `
        -Method GET -Headers $headers
    
    Write-Host "  ✓ PASS - Found $($response.Count) customers" -ForegroundColor Green
} catch {
    Write-Host "  ✗ FAIL: $_" -ForegroundColor Red
}

Write-Host "`nBasic tests completed!" -ForegroundColor Cyan
