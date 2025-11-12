# Quick Auth Service Test
$ErrorActionPreference = "Stop"

Write-Host "`n=== QUICK AUTH SERVICE TEST ===" -ForegroundColor Cyan

# Test 1: Register
Write-Host "`n1. Testing Register API..." -ForegroundColor Yellow
$registerBody = @{
    username = "testuser_$(Get-Random -Minimum 1000 -Maximum 9999)"
    email = "test$(Get-Random -Minimum 1000 -Maximum 9999)@example.com"
    password = "Test123!@#"
    fullName = "Test User"
    role = "USER"
}

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/register" `
        -Method POST `
        -Body ($registerBody | ConvertTo-Json) `
        -ContentType "application/json"
    
    Write-Host "   [OK] Register successful" -ForegroundColor Green
    Write-Host "   Token: $($registerResponse.token.Substring(0, 20))..." -ForegroundColor Gray
    $global:authToken = $registerResponse.token
    $global:username = $registerBody.username
} catch {
    Write-Host "   [FAIL] Register failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Login
Write-Host "`n2. Testing Login API..." -ForegroundColor Yellow
$loginBody = @{
    username = $global:username
    password = "Test123!@#"
}

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" `
        -Method POST `
        -Body ($loginBody | ConvertTo-Json) `
        -ContentType "application/json"
    
    Write-Host "   [OK] Login successful" -ForegroundColor Green
    Write-Host "   Role: $($loginResponse.role)" -ForegroundColor Gray
    $global:authToken = $loginResponse.token
} catch {
    Write-Host "   [FAIL] Login failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 3: Get Profile
Write-Host "`n3. Testing Get Profile API..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $($global:authToken)"
    }
    
    $profileResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/profile" `
        -Method GET `
        -Headers $headers
    
    Write-Host "   [OK] Get profile successful" -ForegroundColor Green
    Write-Host "   Username: $($profileResponse.username)" -ForegroundColor Gray
    Write-Host "   Email: $($profileResponse.email)" -ForegroundColor Gray
    Write-Host "   Role: $($profileResponse.role)" -ForegroundColor Gray
} catch {
    Write-Host "   [FAIL] Get profile failed" -ForegroundColor Red
    Write-Host "   Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Update Profile
Write-Host "`n4. Testing Update Profile API..." -ForegroundColor Yellow
$updateBody = @{
    fullName = "Updated Test User"
}

try {
    $headers = @{
        "Authorization" = "Bearer $($global:authToken)"
    }
    
    $updateResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/profile" `
        -Method PUT `
        -Headers $headers `
        -Body ($updateBody | ConvertTo-Json) `
        -ContentType "application/json"
    
    Write-Host "   [OK] Update profile successful" -ForegroundColor Green
    Write-Host "   New name: $($updateResponse.fullName)" -ForegroundColor Gray
} catch {
    Write-Host "   [FAIL] Update profile failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Verify Token
Write-Host "`n5. Testing Verify Token API..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $($global:authToken)"
    }
    
    $verifyResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/verify" `
        -Method GET `
        -Headers $headers
    
    Write-Host "   [OK] Verify token successful" -ForegroundColor Green
    Write-Host "   Valid: $($verifyResponse.valid)" -ForegroundColor Gray
} catch {
    Write-Host "   [FAIL] Verify token failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TEST COMPLETED ===" -ForegroundColor Cyan
Write-Host "All basic auth APIs are working!" -ForegroundColor Green
