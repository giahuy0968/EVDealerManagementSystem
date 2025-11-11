# AUTH SERVICE - API TEST SCRIPT
# Test all main endpoints

$baseUrl = "http://localhost:3001/api/v1/auth"
$testEmail = "testuser_$(Get-Random)@example.com"
$testUsername = "user_$(Get-Random)"
$testPassword = "TestPass123!"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   AUTH SERVICE - API TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "[1/7] Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/actuator/health"
    Write-Host "OK - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
}

# Test 2: API Test
Write-Host "[2/7] API Test Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/test"
    Write-Host "OK - $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
}

# Test 3: Register
Write-Host "[3/7] Register User..." -ForegroundColor Yellow
$registerBody = @{
    username = $testUsername
    email = $testEmail
    password = $testPassword
    fullName = "Test User"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/register" -Method POST -Body $registerBody -ContentType "application/json"
    $registerData = $response.Content | ConvertFrom-Json
    Write-Host "OK - User ID: $($registerData.userId)" -ForegroundColor Green
    $userId = $registerData.userId
} catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
}

# Test 4: Login
Write-Host "[4/7] Login..." -ForegroundColor Yellow
$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/login" -Method POST -Body $loginBody -ContentType "application/json"
    $loginData = $response.Content | ConvertFrom-Json
    Write-Host "OK - Role: $($loginData.role)" -ForegroundColor Green
    $accessToken = $loginData.accessToken
    $refreshToken = $loginData.refreshToken
} catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
}

# Test 5: Get Profile
Write-Host "[5/7] Get Profile..." -ForegroundColor Yellow
try {
    $headers = @{ "Authorization" = "Bearer $accessToken" }
    $response = Invoke-WebRequest -Uri "$baseUrl/profile" -Headers $headers
    $profileData = $response.Content | ConvertFrom-Json
    Write-Host "OK - Email: $($profileData.email)" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
}

# Test 6: Refresh Token
Write-Host "[6/7] Refresh Token..." -ForegroundColor Yellow
$refreshBody = @{ refreshToken = $refreshToken } | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/refresh" -Method POST -Body $refreshBody -ContentType "application/json"
    Write-Host "OK - Token refreshed" -ForegroundColor Green
    $newTokens = $response.Content | ConvertFrom-Json
    $refreshToken = $newTokens.refreshToken
} catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
}

# Test 7: Logout
Write-Host "[7/7] Logout..." -ForegroundColor Yellow
$logoutBody = @{ refreshToken = $refreshToken } | ConvertTo-Json
try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "$baseUrl/logout" -Method POST -Headers $headers -Body $logoutBody
    Write-Host "OK - Logged out successfully" -ForegroundColor Green
} catch {
    Write-Host "FAILED: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Email: $testEmail" -ForegroundColor White
Write-Host "Test Username: $testUsername" -ForegroundColor White
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
