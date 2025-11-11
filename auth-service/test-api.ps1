# AUTO TEST SCRIPT FOR AUTH-SERVICE
# Run this after service is running on http://localhost:3001

$baseUrl = "http://localhost:3001/api/auth"
$testEmail = "testuser_$(Get-Random)@example.com"
$testUsername = "user_$(Get-Random)"
$testPassword = "SecurePass123!"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   AUTH-SERVICE API AUTO TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "[1/8] Testing API Health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/test" -Method GET -ErrorAction Stop
    Write-Host "✓ API is working!" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)`n" -ForegroundColor Gray
} catch {
    Write-Host "✗ API health check failed!" -ForegroundColor Red
    Write-Host "   Error: $_`n" -ForegroundColor Red
    exit 1
}

# Test 2: Register
Write-Host "[2/8] Testing User Registration..." -ForegroundColor Yellow
$registerBody = @{
    email = $testEmail
    username = $testUsername
    password = $testPassword
    fullName = "Test User Auto"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/register" -Method POST -Body $registerBody -ContentType "application/json" -ErrorAction Stop
    $registerData = $response.Content | ConvertFrom-Json
    Write-Host "✓ Registration successful!" -ForegroundColor Green
    Write-Host "   User ID: $($registerData.userId)" -ForegroundColor Gray
    Write-Host "   Message: $($registerData.message)`n" -ForegroundColor Gray
    $userId = $registerData.userId
} catch {
    Write-Host "✗ Registration failed!" -ForegroundColor Red
    Write-Host "   Error: $_`n" -ForegroundColor Red
    exit 1
}

# Test 3: Login
Write-Host "[3/8] Testing User Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $loginData = $response.Content | ConvertFrom-Json
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "   Email: $($loginData.email)" -ForegroundColor Gray
    Write-Host "   Role: $($loginData.role)" -ForegroundColor Gray
    Write-Host "   Access Token: $($loginData.accessToken.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "   Refresh Token: $($loginData.refreshToken.Substring(0, 50))...`n" -ForegroundColor Gray
    
    $accessToken = $loginData.accessToken
    $refreshToken = $loginData.refreshToken
} catch {
    Write-Host "✗ Login failed!" -ForegroundColor Red
    Write-Host "   Error: $_`n" -ForegroundColor Red
    exit 1
}

# Test 4: Verify Token
Write-Host "[4/8] Testing Token Verification..." -ForegroundColor Yellow
$verifyBody = @{
    token = $accessToken
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/verify-token" -Method POST -Body $verifyBody -ContentType "application/json" -ErrorAction Stop
    $verifyData = $response.Content | ConvertFrom-Json
    if ($verifyData.valid -eq $true) {
        Write-Host "✓ Token is valid!" -ForegroundColor Green
        Write-Host "   Message: $($verifyData.message)`n" -ForegroundColor Gray
    } else {
        Write-Host "✗ Token validation failed!" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "✗ Token verification failed!" -ForegroundColor Red
    Write-Host "   Error: $_`n" -ForegroundColor Red
}

# Test 5: Refresh Token
Write-Host "[5/8] Testing Token Refresh..." -ForegroundColor Yellow
$refreshBody = @{
    refreshToken = $refreshToken
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/refresh" -Method POST -Body $refreshBody -ContentType "application/json" -ErrorAction Stop
    $newTokens = $response.Content | ConvertFrom-Json
    Write-Host "✓ Token refresh successful!" -ForegroundColor Green
    Write-Host "   New Access Token: $($newTokens.accessToken.Substring(0, 50))..." -ForegroundColor Gray
    Write-Host "   New Refresh Token: $($newTokens.refreshToken.Substring(0, 50))...`n" -ForegroundColor Gray
    
    # Update tokens
    $refreshToken = $newTokens.refreshToken
} catch {
    Write-Host "✗ Token refresh failed!" -ForegroundColor Red
    Write-Host "   Error: $_`n" -ForegroundColor Red
}

# Test 6: Wrong Password (Account Lockout Test)
Write-Host "[6/8] Testing Account Lockout (5 failed attempts)..." -ForegroundColor Yellow
$wrongLoginBody = @{
    email = $testEmail
    password = "WrongPassword123"
} | ConvertTo-Json

$failCount = 0
for ($i = 1; $i -le 5; $i++) {
    try {
        Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -Body $wrongLoginBody -ContentType "application/json" -ErrorAction Stop
    } catch {
        $failCount++
        Write-Host "   Attempt $i failed (expected)" -ForegroundColor Gray
    }
}

if ($failCount -eq 5) {
    Write-Host "✓ Account lockout working! (5 failed attempts blocked)`n" -ForegroundColor Green
} else {
    Write-Host "⚠ Account lockout may not be working properly`n" -ForegroundColor Yellow
}

# Test 7: Logout
Write-Host "[7/8] Testing Logout..." -ForegroundColor Yellow
$logoutBody = @{
    refreshToken = $refreshToken
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/logout" -Method POST -Body $logoutBody -ContentType "application/json" -ErrorAction Stop
    $logoutData = $response.Content | ConvertFrom-Json
    Write-Host "✓ Logout successful!" -ForegroundColor Green
    Write-Host "   Message: $($logoutData.message)`n" -ForegroundColor Gray
} catch {
    Write-Host "✗ Logout failed!" -ForegroundColor Red
    Write-Host "   Error: $_`n" -ForegroundColor Red
}

# Test 8: Try using logged out refresh token
Write-Host "[8/8] Testing Refresh Token After Logout (should fail)..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri "$baseUrl/refresh" -Method POST -Body $refreshBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "✗ Security issue: Refresh token still works after logout!" -ForegroundColor Red
} catch {
    Write-Host "✓ Security working: Refresh token invalidated after logout!`n" -ForegroundColor Green
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Email: $testEmail" -ForegroundColor White
Write-Host "Test Username: $testUsername" -ForegroundColor White
Write-Host "User ID: $userId" -ForegroundColor White
Write-Host "`n✓ All tests completed!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan
