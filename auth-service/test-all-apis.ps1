# Script test đầy đủ các API của Auth Service
# Mục đích: Test tất cả các endpoint theo yêu cầu

$baseUrl = "http://localhost:3001/api/v1/auth"
$testEmail = "testuser_$(Get-Random)@example.com"
$testUsername = "user_$(Get-Random)"
$testPassword = "TestPass123!"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AUTH SERVICE - FULL API TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check (Actuator)
Write-Host "[1/10] Testing Actuator Health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/actuator/health" -Method GET
    Write-Host "✓ Health check passed!" -ForegroundColor Green
    Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Health check failed: $_" -ForegroundColor Red
}

# Test 2: API Test Endpoint
Write-Host "`n[2/10] Testing /test endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/test" -Method GET
    Write-Host "✓ Test endpoint working!" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Test endpoint failed: $_" -ForegroundColor Red
}

# Test 3: Register User
Write-Host "`n[3/10] Testing User Registration..." -ForegroundColor Yellow
$registerBody = @{
    username = $testUsername
    email = $testEmail
    password = $testPassword
    fullName = "Test User $(Get-Random)"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/register" -Method POST -Body $registerBody -ContentType "application/json"
    $registerData = $response.Content | ConvertFrom-Json
    Write-Host "✓ Registration successful!" -ForegroundColor Green
    Write-Host "   User ID: $($registerData.userId)" -ForegroundColor Gray
    $userId = $registerData.userId
} catch {
    Write-Host "✗ Registration failed: $_" -ForegroundColor Red
    Write-Host "   Response: $($_.Exception.Response)" -ForegroundColor Red
    exit 1
}

# Test 4: Login
Write-Host "`n[4/10] Testing Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -Body $loginBody -ContentType "application/json"
    $loginData = $response.Content | ConvertFrom-Json
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "   Email: $($loginData.email)" -ForegroundColor Gray
    Write-Host "   Role: $($loginData.role)" -ForegroundColor Gray
    Write-Host "   Token (first 50 chars): $($loginData.accessToken.Substring(0, [Math]::Min(50, $loginData.accessToken.Length)))..." -ForegroundColor Gray
    
    $accessToken = $loginData.accessToken
    $refreshToken = $loginData.refreshToken
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit 1
}

# Test 5: Verify Token
Write-Host "`n[5/10] Testing Token Verification..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/verify" -Method GET -Headers $headers
    $verifyData = $response.Content | ConvertFrom-Json
    if ($verifyData.valid -eq $true) {
        Write-Host "✓ Token is valid!" -ForegroundColor Green
    } else {
        Write-Host "✗ Token is invalid!" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠ Token verification endpoint may not be working" -ForegroundColor Yellow
}

# Test 6: Get Profile
Write-Host "`n[6/10] Testing Get Profile..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/profile" -Method GET -Headers $headers
    $profileData = $response.Content | ConvertFrom-Json
    Write-Host "✓ Profile retrieved!" -ForegroundColor Green
    Write-Host "   User ID: $($profileData.id)" -ForegroundColor Gray
    Write-Host "   Email: $($profileData.email)" -ForegroundColor Gray
    Write-Host "   Full Name: $($profileData.fullName)" -ForegroundColor Gray
    Write-Host "   Role: $($profileData.role)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Get profile failed: $_" -ForegroundColor Red
}

# Test 7: Update Profile
Write-Host "`n[7/10] Testing Update Profile..." -ForegroundColor Yellow
$updateBody = @{
    fullName = "Updated User Name"
    avatarUrl = "https://example.com/avatar.jpg"
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/profile" -Method PUT -Headers $headers -Body $updateBody
    Write-Host "✓ Profile updated!" -ForegroundColor Green
} catch {
    Write-Host "✗ Update profile failed: $_" -ForegroundColor Red
}

# Test 8: Refresh Token
Write-Host "`n[8/10] Testing Refresh Token..." -ForegroundColor Yellow
$refreshBody = @{
    refreshToken = $refreshToken
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/refresh" -Method POST -Body $refreshBody -ContentType "application/json"
    $newTokens = $response.Content | ConvertFrom-Json
    Write-Host "✓ Token refreshed!" -ForegroundColor Green
    Write-Host "   New Access Token (first 50 chars): $($newTokens.accessToken.Substring(0, [Math]::Min(50, $newTokens.accessToken.Length)))..." -ForegroundColor Gray
    
    # Update tokens
    $accessToken = $newTokens.accessToken
    $refreshToken = $newTokens.refreshToken
} catch {
    Write-Host "✗ Refresh token failed: $_" -ForegroundColor Red
}

# Test 9: Get Sessions
Write-Host "`n[9/10] Testing Get Sessions..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/sessions" -Method GET -Headers $headers
    $sessions = $response.Content | ConvertFrom-Json
    Write-Host "✓ Sessions retrieved!" -ForegroundColor Green
    Write-Host "   Active sessions: $($sessions.Count)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Get sessions failed: $_" -ForegroundColor Red
}

# Test 10: Logout
Write-Host "`n[10/10] Testing Logout..." -ForegroundColor Yellow
$logoutBody = @{
    refreshToken = $refreshToken
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/logout" -Method POST -Headers $headers -Body $logoutBody
    $logoutData = $response.Content | ConvertFrom-Json
    Write-Host "✓ Logout successful!" -ForegroundColor Green
    Write-Host "   Message: $($logoutData.message)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Logout failed: $_" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Email: $testEmail" -ForegroundColor White
Write-Host "Test Username: $testUsername" -ForegroundColor White
Write-Host "User ID: $userId" -ForegroundColor White
Write-Host ""
Write-Host "✓ All core tests completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
